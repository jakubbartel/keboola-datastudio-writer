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
     * The source of life.
     */
    public function run() : void
    {
        $metrics = explode(',', $this->getConfig()->getValue(['parameters', 'metrics'], ''));

        $writer = new Writer($metrics);

        $writer->process();
    }

}
