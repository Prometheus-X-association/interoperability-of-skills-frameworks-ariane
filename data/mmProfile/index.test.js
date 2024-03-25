import { mapValuesToJSONLD, applyMapping, detectType, ontoTermTransform, mappingRules } from './JsonToJSONLDMapping.js';

describe('mapValuesToJSONLD', () => {
    it('maps single value correctly', () => {
        const result = mapValuesToJSONLD('testValue', { "@type": "xsd:string", "@id": "test:id" });
        expect(result).toEqual({ "@id": "test:id", "@value": "testValue", "@type": "xsd:string" });
    });

    it('maps array of values correctly', () => {
        const result = mapValuesToJSONLD(['value1', 'value2'], { "@type": "xsd:string" });
        expect(result).toEqual([{ "@value": "value1", "@type": "xsd:string" }, { "@value": "value2", "@type": "xsd:string" }]);
    });
});

describe('applyMapping', () => {
    it('applies mapping rules correctly', () => {
        const item = { "date": "2021-01-01", "keywords": "test" };
        const rules = mappingRules.educationalResource;
        const result = applyMapping(item, rules);
        expect(result).toHaveProperty("mms:date");
        expect(result).toHaveProperty("mms:keywords");
    });
});

describe('detectType', () => {
    it('detects the correct type', () => {
        const item = { "Experience Ids": [1, 2, 3] };
        expect(detectType(item)).toEqual("userExperience");
    });
});

describe('ontoTermTransform', () => {
    it('transforms input data correctly', async () => {
        const inputData = [{ "date": "2021-01-01", "keywords": "test" }];
        const result = ontoTermTransform(inputData, mappingRules);
        expect(result.graph.length).toBe(1);
        expect(result["@context"]).toBeDefined();
    });
});
