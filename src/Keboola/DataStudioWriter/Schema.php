<?php declare(strict_types = 1);

namespace Keboola\DataStudioWriter;

use JsonSerializable;

class Schema implements JsonSerializable
{

    /**
     * @var array
     */
    private $fields;

    /**
     * @param string $name
     * @param string $label
     * @return Schema
     */
    public function addDimension(string $name, string $label): self
    {
        $this->fields[] = [
            'name' => $name,
            'label' => $label,
            'dataType' => 'STRING',
        ];

        return $this;
    }

    /**
     * @param string $name
     * @param string $label
     * @return Schema
     */
    public function addMetric(string $name, string $label): self
    {
        $this->fields[] = [
            'name' => $name,
            'label' => $label,
            'dataType' => 'STRING',
            'semantics' => [
                'conceptType' => 'METRIC',
                'isReaggregatable' => true,
            ],
        ];

        return $this;
    }

    /**
     * @return array
     */
    public function jsonSerialize()
    {
        return $this->fields;
    }
}
