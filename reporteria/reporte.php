<?php

require 'PHPExcel/Classes/PHPExcel.php';

set_time_limit(6000);

// Configuración de la conexión PDO a la base de datos SQL Server
$serverName = "10.220.1.5";
$database = "EPKER";
$username = "sa";
$password = "29060508Ira";

try {
    $conn = new PDO("sqlsrv:Server=$serverName;Database=$database", $username, $password);
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Tu stored procedure
    $sp = "SP_GETREPORTE";

    // Valores de los parámetros
    $param1 = $_GET['fechaInicio'];
    $param2 = $_GET['fechaLimite'];
    $param3 = $_GET['firma'];
    $param4 = $_GET['producto'];
    $param5 = $_GET['tipoReporte'];
    $param6 = $_GET['nombreReporte'];

	$param6 = isset($param6) || !empty($param6) ? $param6.'_'.date('Y-m-d')  : 'exportacion_'.date('Y-m-d');


    // Preparar la ejecución del stored procedure con parámetros
    $stmt = $conn->prepare("EXEC $sp :param1, :param2, :param3, :param4, :param5");
    $stmt->bindParam(':param1', $param1, PDO::PARAM_STR);
    $stmt->bindParam(':param2', $param2, PDO::PARAM_STR);
    $stmt->bindParam(':param3', $param3, PDO::PARAM_INT);
    $stmt->bindParam(':param4', $param4, PDO::PARAM_INT);
    $stmt->bindParam(':param5', $param5, PDO::PARAM_INT);

    // Ejecutar el stored procedure
    $stmt->execute();

    // Crear un nuevo objeto PHPExcel
    $objPHPExcel = new PHPExcel();

    // Configurar las propiedades del documento
    $objPHPExcel->getProperties()
        ->setCreator("Tu Nombre")
        ->setLastModifiedBy("Tu Nombre")
        ->setTitle("Exportación a Excel")
        ->setSubject("Exportación a Excel")
        ->setDescription("Exportación de datos desde una tabla de SQL Server a Excel")
        ->setKeywords("excel php sqlserver")
        ->setCategory("Excel");

    // Agregar los datos de la consulta al archivo Excel
    $row = 1;
    while ($fila = $stmt->fetch(PDO::FETCH_ASSOC)) {
        $col = 0;
        foreach ($fila as $campo) {
            $objPHPExcel->getActiveSheet()->setCellValueByColumnAndRow($col, $row, $campo);
            $col++;
        }
        $row++;
    }

    // Configurar el nombre de la hoja
    $objPHPExcel->getActiveSheet()->setTitle('Hoja1');

    // Configurar el tipo de contenido y el nombre del archivo
    header('Content-Type: text/csv');
  header('Content-Disposition: attachment;filename=' . $param6 . '.csv');

    // Crear el escritor de CSV y enviar el archivo al navegador para su descarga
    $objWriter = PHPExcel_IOFactory::createWriter($objPHPExcel, 'CSV');
    $objWriter->save('php://output');

    // Cerrar el objeto PHPExcel para liberar recursos
    $objPHPExcel->disconnectWorksheets();
    unset($objPHPExcel);

} catch (PDOException $e) {
    die("Error al conectar: " . $e->getMessage());
}
