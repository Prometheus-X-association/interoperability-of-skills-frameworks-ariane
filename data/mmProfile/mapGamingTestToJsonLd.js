import fs from 'fs';

const mappingRules = {
    "Experience Name": "soo:experienceName",
    "Date": { key: "soo:date", type: "xsd:date" },
    "Associated Soft Skill Block": "soo:associatedSkillBlock",
    "Results": "soo:result",
    "User ID": { key: "soo:experienceOf", type: "soo:User", label: "rdfs:label" }
};

function applyMapping(item, rules) {
    const mappedItem = { "@type": "soo:Experience" };
    for (const inputKey in item) {
        const rule = rules[inputKey];
        if (typeof rule === "string") {
            mappedItem[rule] = { "@value": item[inputKey] };
        } else if (typeof rule === "object" && rule.type) {
            if (rule.label) {
                mappedItem[rule.key] = {
                    "@type": rule.type,
                    [rule.label]: { "@value": item[inputKey] }
                };
            } else {
                mappedItem[rule.key] = { "@value": item[inputKey], "@type": rule.type };
            }
        }
        // Handle other cases or complex mappings
    }
    return mappedItem;
}

function mapToJsonLd(inputData, rules) {
    return inputData.map(item => applyMapping(item, rules));
}

function main() {
    const inputJsonPath = './input.json';
    const inputData = JSON.parse(fs.readFileSync(inputJsonPath, 'utf8'));
    const mappedData = mapToJsonLd(inputData, mappingRules);

    // Load the context from a file or define it here
    const ontologyPath = './mm-profile-1.0.0.jsonld';
    const context = JSON.parse(fs.readFileSync(ontologyPath, 'utf8'))['@context'];

    const output = {
        "@context": context,
        "@graph": mappedData
    };

    const outputPath = './output.jsonld';
    fs.writeFileSync(outputPath, JSON.stringify(output, null, 2));
    console.log(`The JSON-LD data has been saved to ${outputPath}`);
}

main();


// import fs from 'fs';
//
// const inputJson = './input.json'
// function mapGamingTestToJsonLd(inputJson) {
//     function readJson(filePath) {
//         const fileData = fs.readFileSync(filePath, 'utf8');
//         return JSON.parse(fileData); // parse JSON string to JSON object
//     }
//
//     const inputData = readJson(inputJson)
//
//     const experiences = inputData.map(item => ({
//         "@type": "soo:Experience",
//         "soo:experienceName": { "@value": item["Experience Name"] },
//         "soo:date": { "@value": item["Date"], "@type": "xsd:date" },
//         "soo:associatedSkillBlock": { "@value": item["Associated Soft Skill Block"] },
//         "soo:result": { "@value": item["Results"] },
//         "soo:experienceOf": {
//             "@type": "soo:User",
//             "rdfs:label": { "@value": item["User ID"] }
//         }
//     }));
//
//     const ontologyPath = './mm-profile-1.0.0.jsonld'
//
//     const context = readJson(ontologyPath)['@context']
//
//     console.log(context);
//
//     return {
//         "@context": context,
//         "@graph": experiences
//     };
// }
//
// const mappedJsonLd = mapGamingTestToJsonLd(inputJson);
//
// const jsonLdString = JSON.stringify(mappedJsonLd, null, 2);
//
// const outputPath = './output.jsonld';
//
// fs.writeFileSync(outputPath, jsonLdString);
//
// console.log(`The JSON-LD data has been saved to ${outputPath}`);
//
// //console.log(JSON.stringify(mappedJsonLd, null, 2));