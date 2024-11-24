USE [EPKER]
GO
/****** Object:  StoredProcedure [dbo].[SP_GENERAR_PDF_CAME]    Script Date: 04/04/2022 01:23:14 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[SP_GENERAR_PDF_CAME]
	@id_plantilla int,
	@termino varchar(100)
AS
BEGIN
	SET NOCOUNT ON;
	
	/** Variables para los datos de los clientes **/
	DECLARE @cliente  VARCHAR(MAX)
	DECLARE @domicilio VARCHAR(MAX)
	DECLARE @colonia VARCHAR(MAX)
	DECLARE @delegacion VARCHAR(MAX)
	DECLARE @codigo_postal VARCHAR(MAX)
	DECLARE @saldo_actual VARCHAR(MAX)
	DECLARE @numero_cuenta VARCHAR(MAX)

	

	/** Variables **/
	DECLARE @plantilla VARCHAR(MAX)
	DECLARE @encabezado VARCHAR(MAX)
	DECLARE @pie VARCHAR(MAX)

	
	CREATE TABLE #temp_plantillas_replazadas (
			[plantilla][nvarchar](max)
	)

	--	Creamos el cursor y los abrimos.
	DECLARE mi_cursor CURSOR STATIC READ_ONLY FOR ( SELECT 
														nombre_socio as cliente, 
														CONCAT('Calle: ', ISNULL(calle,'S/N'), ', No Exterior: ', ISNULL(numero_exterior, 'S/N')) as domicilio,
														colonia,
														delegacion as poblacion, 
														codigo_postal,
														mora_total AS saldo_actual, 
														no_ggi AS numero_cuenta
													FROM clientes_came 
													WHERE no_ggi LIKE '%' + @termino + '%' 
													OR id_socio  LIKE '%' + @termino + '%')
	OPEN mi_cursor 
	
	-- Iteramos por primera vez los datos del cursor
	FETCH NEXT FROM mi_cursor INTO @cliente, @domicilio, @colonia,@delegacion, @codigo_postal,
	@saldo_actual,@numero_cuenta

	-- Recorremos los registros para cambiar las varibles
	WHILE @@FETCH_STATUS = 0 
		BEGIN 
			set @plantilla = (SELECT [plantilla] FROM [carteo_plantillas] where [id] = @id_plantilla )	
			set @encabezado = (SELECT [img_encabezado] FROM [carteo_plantillas] where [id] = @id_plantilla )	
			set @pie = (SELECT [img_pie] FROM [carteo_plantillas] where [id] = @id_plantilla )	

			set @plantilla = REPLACE(@plantilla, '#001', @cliente)
			set @plantilla = REPLACE(@plantilla, '#002', @domicilio)
			set @plantilla = REPLACE(@plantilla, '#003', @colonia)
			set @plantilla = REPLACE(@plantilla, '#004', @delegacion)
			set @plantilla = REPLACE(@plantilla, '#005', @codigo_postal)
			set @plantilla = REPLACE(@plantilla, '#006', @saldo_actual)
			set @plantilla = REPLACE(@plantilla, '#007', @numero_cuenta)
			set @plantilla = REPLACE(@plantilla, '#encabezado', @encabezado)
			set @plantilla = REPLACE(@plantilla, '#pie', @pie)

			INSERT INTO #temp_plantillas_replazadas ( plantilla ) VALUES ( @plantilla )

			--Iteramos los demas datos.
			FETCH NEXT FROM mi_cursor INTO @cliente, @domicilio, @colonia,@delegacion, @codigo_postal,
			@saldo_actual,@numero_cuenta
		END

			CLOSE mi_cursor
			DEALLOCATE mi_cursor

			SELECT * FROM #temp_plantillas_replazadas
		
END
