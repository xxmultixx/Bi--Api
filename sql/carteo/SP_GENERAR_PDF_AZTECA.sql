USE [EPKER]
GO
/****** Object:  StoredProcedure [dbo].[SP_GENERAR_PDF_AZTECA]    Script Date: 05/04/2022 06:11:51 p. m. ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[SP_GENERAR_PDF_AZTECA]
	@id_plantilla int,
	@pcodigo_postal varchar(100),
	@pcolonia varchar(500) = '',
	@ppoblacion varchar(500) = '',
	@pestado varchar(500) = '',
	@pgerencia varchar(500) = '',
	@saldo_total_min varchar(500) = '',
	@saldo_total_max varchar(500) = '',
	@atraso_maximo_min varchar(500) = '',
	@atraso_maximo_max varchar(500) = ''
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @query varchar(max);
	DECLARE @numero_cuenta varchar(300)
	DECLARE @cliente varchar(300)
	DECLARE @codigo_postal varchar(300)
	DECLARE @direccion varchar(300)
	DECLARE @colonia varchar(300)
	DECLARE @poblacion varchar(300)
	DECLARE @saldo_actual varchar(300)
	DECLARE @num_int varchar(300)
	DECLARE @num_ext varchar(300)

	DECLARE @encabezado varchar(300)
	DECLARE @pie varchar(300)

	DECLARE @plantilla varchar(max)

	CREATE TABLE #temp_plantillas_replazadas (
		[plantilla][nvarchar](max)
	)

	CREATE TABLE #temp_clientes (
		[numero_cuenta][varchar](500),
		[cliente][varchar](500),
		[codigo_postal][varchar](500),
		[direccion][varchar](500),
		[colonia][varchar](500),
		[poblacion][varchar](500),
		[saldo_actual][varchar](500),
		[num_ext][varchar](500),
		[num_int][varchar](500),
	)
	/** Construir la query para traer los clientes filtrados **/
	SET @query = 'SELECT 
		cliente_unico as numero_cuenta, 
		nombre_cte as cliente, 
		cp_cte as codigo_postal,
		direccion_cte as direccion,
		colonia_cte as colonia,  
		poblacion_cte as poblacion,
		saldo_total as saldo_actual,
		num_ext_cte,
		num_int_cte
	FROM clientes_banco_azteca WHERE cp_cte = CONVERT(VARCHAR,''' + @pcodigo_postal + ''') ' 

	if( @pcolonia != ''  )
		BEGIN
			SET @query += ' AND LOWER(colonia_cte) = LOWER( ''' + @pcolonia + ''') '
		END

	if(@ppoblacion != '')
		BEGIN 
			SET @query += ' AND LOWER(CONVERT(VARCHAR, poblacion_cte)) = LOWER(''' + @ppoblacion + ''') '
		END

	if(@pestado != '')
		BEGIN 
			SET @query += ' AND LOWER(estado_cte) = LOWER( ''' + @pestado + ''') '
		END

	if(@pgerencia != '')
		BEGIN
			SET @query += ' AND LOWER(CONVERT(VARCHAR, gerencia)) = LOWER( ''' + @pgerencia + ''') '
		END

	if( @saldo_total_min != '' AND @saldo_total_max != '' )
		BEGIN 
			SET @query += ' AND saldo_total BETWEEN ''' + @saldo_total_min + ''' AND ''' +  @saldo_total_max + ''''
		END

	if(@atraso_maximo_min != '' AND @atraso_maximo_max != '')
		BEGIN
			SET @query += ' AND atraso_maximo BETWEEN CONVERT(INT,''' + @atraso_maximo_min  + ''') and CONVERT(INT,''' + @atraso_maximo_max + ''') '
		END	

	-- Insertar los clientes en una tabla temporal
	insert into #temp_clientes EXEC (@query)

	--	Creamos el cursor y los abrimos.
	DECLARE mi_cursor CURSOR STATIC READ_ONLY FOR ( SELECT numero_cuenta,cliente, codigo_postal,
														direccion, colonia, poblacion, saldo_actual,
														num_ext, num_int
													FROM #temp_clientes 
													)
	OPEN mi_cursor 
	
	-- Empizo con la primera iteracion
	FETCH NEXT FROM mi_cursor INTO  @numero_cuenta, @cliente,
		@codigo_postal, @direccion, @colonia, @poblacion, @saldo_actual, @num_ext, @num_int 


	-- Recorremos los registros para cambiar las varibles
	WHILE @@FETCH_STATUS = 0 
	BEGIN 
		--set @plantilla = (SELECT [plantilla] FROM [carteo_plantillas] where [id] = @id_plantilla )	

		set @plantilla = ( SELECT REPLACE(plantilla, '#body', ( 
								SELECT body FROM carteo_plantillas WHERE id =  @id_plantilla)) AS plantilla 
						   FROM carteo_plantillas WHERE id =  @id_plantilla )


		set @encabezado = (SELECT [img_encabezado] FROM [carteo_plantillas] where [id] = @id_plantilla )	
		set @pie = (SELECT [img_pie] FROM [carteo_plantillas] where [id] = @id_plantilla )	


		set @plantilla = REPLACE(@plantilla, '#001', @cliente)
		set @plantilla = REPLACE(@plantilla, '#002', CONCAT('Calle: ', @direccion, ', No Exterior: ', @num_ext, ', No Interior: ', @num_int ))
		set @plantilla = REPLACE(@plantilla, '#003', @colonia)
		set @plantilla = REPLACE(@plantilla, '#004', @poblacion)
		set @plantilla = REPLACE(@plantilla, '#005', @codigo_postal)
		set @plantilla = REPLACE(@plantilla, '#006', @saldo_actual)
		set @plantilla = REPLACE(@plantilla, '#007', @numero_cuenta)
		set @plantilla = REPLACE(@plantilla, '#encabezado', @encabezado)
		set @plantilla = REPLACE(@plantilla, '#pie', @pie)

		insert into #temp_plantillas_replazadas ( plantilla ) values ( @plantilla )

		--Obtener el siguiente registro
		FETCH NEXT FROM mi_cursor INTO  @numero_cuenta, @cliente,
		@codigo_postal, @direccion, @colonia, @poblacion, @saldo_actual, @num_ext, @num_int 

	END

	CLOSE mi_cursor
	DEALLOCATE mi_cursor

	SELECT * FROM #temp_plantillas_replazadas
END
