<?php declare(strict_types = 1);

namespace Keboola\DataStudioWriter;

class Writer
{

    /**
     * @var string[]
     */
    private $metrics;

    /**
     * Extractor constructor.
     *
     * @param string[] $metrics
     */
    public function __construct(array $metrics)
    {
        $this->metrics = $metrics;
    }

    protected function generateDataStudioSchema(): self {
        return $this;
    }

    /**
     *
     */
    public function process(): void
    {
        // generateDataStudioSchema($manifest, $metrics);
        // copy table to file
    }

}
