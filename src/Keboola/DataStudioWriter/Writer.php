<?php declare(strict_types = 1);

namespace Keboola\DataStudioWriter;

class Writer
{

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
     * @param string[] $metricColumns
     */
    public function __construct(array $metricColumns)
    {
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
    private function schemaToFile(string $schemaFilePath): self {
        file_put_contents($schemaFilePath, json_encode($this->schema));

        return $this;
    }

    /**
     * @param string $tableDataPath
     * @param string $fileDataPath
     * @return Writer
     */
    private function copyTableToFile(string $tableDataPath, string $fileDataPath): self
    {
        copy($tableDataPath, $fileDataPath);

        return $this;
    }

    /**
     * @param string $tableDataPath
     * @param string $fileDataPath
     * @return Writer
     */
    private function copyGzTableToFile(string $tableDataPath, string $fileDataPath): self
    {
        $gz = gzopen($fileDataPath,'wb9');
        gzwrite($gz, file_get_contents($tableDataPath));
        gzclose($gz);

        return $this;
    }

    /**
     * @param string $tableDataPath
     * @param string $fileDataPath
     * @return Writer
     */
    private function copyGzTableSampleToFile(string $tableDataPath, string $fileDataPath, int $limitBytes): self
    {
        $f = fopen($tableDataPath, 'r');

        $sample = '';
        $sampleCompressed = '';

        $i_line = 0;

        while(($line = fgets($f)) !== false) {
            $i_line += 1;

            $sample .= $line;

            $compressed = gzencode($sample);

            if($i_line > 1000 || strlen($compressed) > $limitBytes) {
                break;
            }

            $sampleCompressed = $compressed;
        }

        fclose($f);

        file_put_contents($fileDataPath, $sampleCompressed);

        return $this;
    }

    /**
     * @param array $columns
     * @param string $tableDataPath
     * @param string $fileDataPath
     * @param string $schemaFilePath
     */
    public function process(array $columns, string $tableDataPath, string $fileDataPath, string $schemaFilePath): void
    {
        $this->generateDataStudioSchema($columns)->schemaToFile($schemaFilePath);

        $this->copyTableToFile($tableDataPath, $fileDataPath);
        $this->copyGzTableToFile($tableDataPath, $fileDataPath . '.gz');
        $this->copyGzTableSampleToFile($tableDataPath, $fileDataPath . '.sample.gz', 90 * 1024);
    }

}
