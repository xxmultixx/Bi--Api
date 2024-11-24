USE [EPKER]
GO
/****** Object:  StoredProcedure [dbo].[SP_GENERAR_PDF_CAME_TARJETON]    Script Date: 14/04/2022 02:10:31 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[SP_GENERAR_PDF_CAME_TARJETON]
	@id_plantilla int,
	@termino varchar(100)
AS
BEGIN
	SET NOCOUNT ON;
	
	/** Variables para los datos de los clientes **/
	DECLARE @sucursal VARCHAR(MAX)
	DECLARE @numero_cuenta VARCHAR(MAX)
	DECLARE @cliente  VARCHAR(MAX)
	DECLARE @domicilio VARCHAR(MAX)
	DECLARE @colonia VARCHAR(MAX)
	DECLARE @delegacion VARCHAR(MAX)
	DECLARE @codigo_postal VARCHAR(MAX)
	DECLARE @telefono VARCHAR(MAX)
	DECLARE @telefonoDos VARCHAR(MAX)
	DECLARE @diasAtraso	VARCHAR(MAX)
	DECLARE @saldo_actual VARCHAR(MAX)
	DECLARE @mora_estatica VARCHAR(MAX)
	DECLARE @minimo_pagar_grupal VARCHAR(MAX)
	DECLARE @monto_x_cliente VARCHAR(MAX)

	/** Variables **/
	DECLARE @plantilla VARCHAR(MAX)
	DECLARE @encabezado VARCHAR(MAX)
	DECLARE @pie VARCHAR(MAX)

	
	CREATE TABLE #temp_plantillas_replazadas (
			[plantilla][nvarchar](max)
	)

	--	Creamos el cursor y los abrimos.
	DECLARE mi_cursor CURSOR STATIC READ_ONLY FOR ( SELECT 
														ISNULL(nombre_sucursal, 'SN') AS nombre_sucursal,
														ISNULL(no_ggi, 'SN') AS numero_cuenta,
														ISNULL(nombre_socio, 'SN') as cliente, 
														CONCAT('Calle: ', ISNULL(calle, 'SN'), ', No Exterior: ', ISNULL(numero_exterior, 'SN')) as domicilio,
														ISNULL(colonia, 'SN') AS colonia,
														ISNULL(delegacion, 'SN') as poblacion, 
														ISNULL(codigo_postal, 'SN') AS codigo_postal,
														ISNULL(telefono, 'SN') AS telefono, 
														ISNULL(telefono2, 'S/N') AS telefonoDos,
														CONCAT(ISNULL(ciclo_vez,'SN'), '-', ISNULL(dias_atraso, 'SN')) as diasAtraso,
														ISNULL(mora_total, 'SN') AS saldo_actual, 
														ISNULL(mora_estadistica, 'SN') AS mora_estatica,
														ISNULL(minimo_pagar, 'SN') AS minimo_pagar_grupal,
														ISNULL(monto_credito_socio, 'SN') AS monto_x_cliente
													FROM clientes_came 
													WHERE no_ggi LIKE '%' + @termino + '%' 
													OR id_socio  LIKE '%' + @termino + '%')
	OPEN mi_cursor 
	
		-- Empizo con la primera iteracion
		FETCH NEXT FROM mi_cursor INTO @sucursal, @numero_cuenta, @cliente, @domicilio,
		@colonia, @delegacion, @codigo_postal, @telefono,
		@telefonoDos, @diasAtraso, @saldo_actual, @mora_estatica,
		@minimo_pagar_grupal, @monto_x_cliente


	-- Recorremos los registros para cambiar las varibles
	WHILE @@FETCH_STATUS = 0 
		BEGIN 
			SET @plantilla = (SELECT [plantilla] FROM [carteo_plantillas] WHERE [id] = @id_plantilla )	
			
			SET @plantilla = REPLACE(@plantilla, '#001', @sucursal)
			SET @plantilla = REPLACE(@plantilla, '#002', @numero_cuenta)
			SET @plantilla = REPLACE(@plantilla, '#003', @cliente)
			SET @plantilla = REPLACE(@plantilla, '#004', @domicilio)
			SET @plantilla = REPLACE(@plantilla, '#005', @colonia)
			SET @plantilla = REPLACE(@plantilla, '#006', @delegacion)
			SET @plantilla = REPLACE(@plantilla, '#007', @telefono)
			SET @plantilla = REPLACE(@plantilla, '#tel', @telefonoDos)
			SET @plantilla = REPLACE(@plantilla, '#009', @diasAtraso)
			SET @plantilla = REPLACE(@plantilla, '#010', @codigo_postal)
			SET @plantilla = REPLACE(@plantilla, '#011', @saldo_actual)
			SET @plantilla = REPLACE(@plantilla, '#012', @mora_estatica)
			SET @plantilla = REPLACE(@plantilla, '#013', @minimo_pagar_grupal)
			SET @plantilla = REPLACE(@plantilla, '#014', @monto_x_cliente)
		
			INSERT INTO #temp_plantillas_replazadas ( plantilla ) VALUES ( @plantilla )

			-- Empizo con la primera iteracion
		FETCH NEXT FROM mi_cursor INTO @sucursal, @numero_cuenta, @cliente, @domicilio,
		@colonia, @delegacion, @codigo_postal, @telefono,
		@telefonoDos, @diasAtraso, @saldo_actual, @mora_estatica,
		@minimo_pagar_grupal, @monto_x_cliente
		END

			CLOSE mi_cursor
			DEALLOCATE mi_cursor

			SELECT * FROM #temp_plantillas_replazadas
		
END
