<?php declare(strict_types = 1);

namespace Keboola\DataStudioWriter;

use Keboola\Component\BaseComponent;

class Component extends BaseComponent
{

    /**
     * @return string
     */
    protected function getConfigDefinitionClass(): string
    {
        return ConfigDefinition::class;
    }

    /**
     * @return array
     * @throws Exception\UserException
     */
    private function getInputTableConfig(): array
    {
        $tables = $this->getConfig()->getInputTables();

        if(count($tables) != 1) {
            throw new Exception\UserException(
                sprintf('Exactly one table is expected in input mapping (%d given)', count($tables))
            );
        }

        return $tables[0];
    }

    /**
     * @param array $table
     * @return string
     */
    private function getTableDataPath(array $table): string
    {
        $tableDataFile = $table['destination'];

        return sprintf('%s/%s/%s', $this->getDataDir(), 'in/tables', $tableDataFile);
    }

    /**
     * @param array $table
     * @return string
     */
    private function getOutputFilePath(array $table): string
    {
        $tableDataFile = $table['destination'];

        return sprintf('%s/%s/%s', $this->getDataDir(), 'out/files', $tableDataFile);
    }

    /**
     * @param array $table
     * @return string
     */
    private function getOutputSchemaPath(array $table): string
    {
        $tableDataFile = $table['destination'];

        return sprintf('%s/%s/%s.schema', $this->getDataDir(), 'out/files', $tableDataFile);
    }

    /**
     * @param array $table
     * @return array
     */
    private function getTableManifest(array $table): array
    {
        $tableDataFile = $table['destination'];

        $manifestFilePath = sprintf('%s/%s/%s.manifest', $this->getDataDir(), 'in/tables', $tableDataFile);

        return json_decode(file_get_contents($manifestFilePath), true);
    }

    /**
     * The source of life.
     *
     * @throws \Exception
     */
    public function run() : void
    {
        if(getenv('KBC_CONFIGID') === false) {
            throw new \Exception('Cannot read required environment variable "KBC_CONFIGID"');
        }

        $configId = intval(getenv('KBC_CONFIGID'));

        $metrics = explode(',', $this->getConfig()->getValue(['parameters', 'metrics'], ''));
        $writer = new Writer($configId, $metrics);

        $tableConfig = $this->getInputTableConfig();
        $manifest = $this->getTableManifest($tableConfig);

        $columns = $manifest['columns'];
        $tableDataPath = $this->getTableDataPath($tableConfig);
        $fileDataPath = $this->getOutputFilePath($tableConfig);
        $schemaFilePath = $this->getOutputSchemaPath($tableConfig);

        $writer->process($columns, $tableDataPath, $fileDataPath, $schemaFilePath);

        $manifest = [
            'is_public' => false,
            'is_permanent' => false,
            'is_encrypted' => false,
            'notify' => false,
            'tags' => [
                'jakub-bartel.wr-data-studio',
                sprintf('datastudio-data-zip.%s', $configId),
            ],
        ];
        file_put_contents($fileDataPath . '.zip' . '.manifest', json_encode($manifest));

        $manifest = [
            'is_public' => false,
            'is_permanent' => false,
            'is_encrypted' => false,
            'notify' => false,
            'tags' => [
                'jakub-bartel.wr-data-studio',
                sprintf('datastudio-data-sample-zip.%s', $configId),
            ],
        ];
        file_put_contents($fileDataPath . '.sample.zip' . '.manifest', json_encode($manifest));

        $manifest = [
            'is_public' => false,
            'is_permanent' => false,
            'is_encrypted' => false,
            'notify' => false,
            'tags' => [
                'jakub-bartel.wr-data-studio',
                sprintf('datastudio-schema.%s', $configId),
            ],
        ];
        file_put_contents($schemaFilePath . '.manifest', json_encode($manifest));
    }

}
