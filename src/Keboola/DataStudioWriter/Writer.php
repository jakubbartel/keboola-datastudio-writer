<?php declare(strict_types = 1);

namespace Keboola\DataStudioWriter;

use Keboola\Csv;
use Keboola\DataStudioWriter\Exception\TableCsvReadException;
use Keboola\DataStudioWriter\Exception\TableCsvWriteException;
use ZipArchive;

class Writer
{

    /**
     * @var int
     */
    private $configId;

    /**
     * @var string[]
     */
    private $metricColumns;

    /**
     * @var Schema
     */
    private $schema;

    /**
     * Extractor constructor.
     *
     * @param int $configId
     * @param string[] $metricColumns
     */
    public function __construct(int $configId, array $metricColumns)
    {
        $this->configId = $configId;

        $this->metricColumns = $metricColumns;

        $this->schema = new Schema();
    }

    /**
     * @param array $columns
     * @return Writer
     */
    private function generateDataStudioSchema(array $columns): self
    {
        foreach($columns as $column) {
            if(in_array($column, $this->metricColumns)) {
                $this->schema->addMetric($column, $column);
            } else {
                $this->schema->addDimension($column, $column);
            }
        }

        return $this;
    }

    /**
     * @param string $schemaFilePath
     * @return Writer
     */
    private function schemaToFile(string $schemaFilePath): self
    {
        file_put_contents($schemaFilePath, json_encode($this->schema));

        return $this;
    }

    /**
     * @param string $tableDataPath
     * @param string $fileDataPath
     * @return Writer
     */
    private function copyZipTableToFile(string $tableDataPath, string $fileDataPath): self
    {
        $zip = new ZipArchive;

        if($zip->open($fileDataPath, ZipArchive::CREATE) === true) {
            $zip->addFile($tableDataPath, 'data.csv');

            $zip->close();
        }

        return $this;
    }

    /**
     * @param string $tableDataPath
     * @param string $fileDataPath
     * @param int $limitRows
     * @param int $limitBytes
     * @return Writer
     * @throws TableCsvReadException
     * @throws TableCsvWriteException
     */
    private function copyZipTableSampleToFile(
        string $tableDataPath,
        string $fileDataPath,
        int $limitRows,
        int $limitBytes
    ): self
    {
        try {
            $csvFile = new Csv\CsvReader($tableDataPath);
        } catch(Csv\Exception $e) {
            throw new TableCsvReadException('Cannot read csv table');
        }

        $sampleTmpTablePath = '/tmp/sample_table.csv';
        $sampleTmpZipTablePath = '/tmp/sample_table.csv.zip';

        try {
            $sampleTmpTable = new Csv\CsvWriter($sampleTmpTablePath);
        } catch(Csv\InvalidArgumentException | Csv\Exception $e) {
            throw new TableCsvWriteException('Cannot write csv table');
        }

        $rows = 0;

        foreach($csvFile as $row) {
            if($rows >= $limitRows) {
                break;
            }

            try {
                $sampleTmpTable->writeRow($row);
            } catch(Csv\Exception $e) {
                throw new TableCsvWriteException('Cannot write csv table data');
            }

            $zip = new ZipArchive;

            if($zip->open($sampleTmpZipTablePath, ZipArchive::CREATE) === true) {
                $zip->addFile($sampleTmpTablePath, 'data.csv');

                $zip->close();
            }

            $size = filesize($sampleTmpZipTablePath);

            if($size > $limitBytes) {
                break;
            }

            copy($sampleTmpZipTablePath, $fileDataPath);

            $rows++;
        }

        return $this;
    }

    /**
     * @param array $columns
     * @param string $tableDataPath
     * @param string $fileDataPath
     * @param string $schemaFilePath
     * @throws TableCsvReadException
     * @throws TableCsvWriteException
     */
    public function process(array $columns, string $tableDataPath, string $fileDataPath, string $schemaFilePath): void
    {
        $this->generateDataStudioSchema($columns)->schemaToFile($schemaFilePath);

        $this->copyZipTableToFile($tableDataPath, $fileDataPath . '.zip');
        $this->copyZipTableSampleToFile($tableDataPath, $fileDataPath . '.sample.zip', 1000, 90 * 1024);
    }

}
