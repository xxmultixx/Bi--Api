USE [EPKER]
GO
/****** Object:  StoredProcedure [dbo].[SP_GENERAR_PDF_APOYO]    Script Date: 05/04/2022 06:11:24 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[SP_GENERAR_PDF_APOYO]
	@id_plantilla int,
	@operacionesId varchar(200)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @plantilla varchar(max)
	DECLARE @cliente varchar(100)
	DECLARE @domicilio varchar(500)
	DECLARE @colonia varchar(500)
	DECLARE @poblacion varchar(500)
	DECLARE @codigoPostal varchar(500)
	DECLARE @saldo_actual varchar(500)
	DECLARE @numero_cuenta varchar(500)
	DECLARE @encabezado varchar(300)
	DECLARE @pie varchar(300)
			
	CREATE TABLE #temp_plantillas_replazadas (
		[plantilla][nvarchar](max)
	)

	
	

	--	Creamos el cursor y los abrimos.
	DECLARE mi_cursor CURSOR STATIC READ_ONLY FOR (   SELECT 
															nombre_cte, -- cliente
															CONCAT('Calle: ', dir, ', No Exterior: ', exterior, ', No Interior: ', interior) as domicilio,
															colonia,
															municipio, -- poblacion
															cp, -- codigo postal
															operacionesid, -- numero de cuenta
															payoff -- saldo actual
													  FROM clientes_apoyo_economico
													  WHERE operacionesid = @operacionesId	)
	OPEN mi_cursor 
	
	-- Empizo con la primera iteracion
	FETCH NEXT FROM mi_cursor INTO @cliente,@domicilio,@colonia,@poblacion,@codigoPostal,@numero_cuenta,@saldo_actual


	-- Recorremos los registros para cambiar las varibles
	WHILE @@FETCH_STATUS = 0 
	BEGIN 
	set @plantilla = (SELECT REPLACE(plantilla, '#body', ( 
							SELECT body FROM carteo_plantillas WHERE id =  @id_plantilla)) AS plantilla 
					  FROM carteo_plantillas WHERE id =  @id_plantilla )


		set @encabezado = (SELECT [img_encabezado] FROM [carteo_plantillas] where [id] = @id_plantilla )	
		set @pie = (SELECT [img_pie] FROM [carteo_plantillas] where [id] = @id_plantilla )	

		set @plantilla = REPLACE(@plantilla, '#001', @cliente)
		set @plantilla = REPLACE(@plantilla, '#002', @domicilio)
		set @plantilla = REPLACE(@plantilla, '#003', @colonia)
		set @plantilla = REPLACE(@plantilla, '#004', @poblacion)
		set @plantilla = REPLACE(@plantilla, '#005', @codigoPostal)
		set @plantilla = REPLACE(@plantilla, '#006', @saldo_actual)
		set @plantilla = REPLACE(@plantilla, '#007', @numero_cuenta)
		set @plantilla = REPLACE(@plantilla, '#encabezado', @encabezado)
		set @plantilla = REPLACE(@plantilla, '#pie', @pie)

		insert into #temp_plantillas_replazadas ( plantilla ) values ( @plantilla )

		--Obtener el siguiente registro
		FETCH NEXT FROM mi_cursor INTO @cliente,@domicilio,@colonia,
		@poblacion,@codigoPostal,@numero_cuenta,@saldo_actual
	END

	CLOSE mi_cursor
	DEALLOCATE mi_cursor

	SELECT * FROM #temp_plantillas_replazadas
END
