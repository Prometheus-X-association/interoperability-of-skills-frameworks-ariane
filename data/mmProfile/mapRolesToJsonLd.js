import fs from 'fs';

// schema to align with input JSON structure
const schema = {
    "Role": {
        "@type": "Role",
        "properties": {
            "name": "name", // Direct mapping for role names
            "knowledges": {
                "@id": "Knowledges" // Mapping to the array of knowledge IDs
            },
            "hardSkills": {
                "@id": "Hard Skills" // Mapping to the array of skill IDs
            }
        }
    }
};

// Function to read and parse JSON file
function readJson(filePath) {
    const fileData = fs.readFileSync(filePath, 'utf8');
    return JSON.parse(fileData);
}

// Validate if the input is an array and log error if not
function validateArray(items, key) {
    if (!Array.isArray(items)) {
        console.error(`Error: Key '${key}' is not an array.`, items);
        return false;
    }
    return true;
}

// Map array items to the JSON-LD structure using the specified property ("@id")
function mapArrayItemsToJsonLd(items, property) {
    return items.map(item => ({ [property]: item }));
}

// Map each role to the JSON-LD format according to the schema
function mapRoleToJSONLD(role, details, schema) {
    const roleJsonLd = { "@type": schema.Role["@type"], "name": role };

    for (const prop in schema.Role.properties) {
        const schemaProperty = schema.Role.properties[prop];
        if (prop === "name") continue; // Skip name as it's already set

        const key = schemaProperty["@id"];
        const items = details[key];

        if (!validateArray(items, key)) {
            roleJsonLd[prop] = [];
            continue;
        }

        roleJsonLd[prop] = mapArrayItemsToJsonLd(items, "@id");
    }

    return roleJsonLd;
}

// Main function to convert input JSON to JSON-LD
function mapRolesToJsonLd(inputJsonPath) {
    const inputData = readJson(inputJsonPath);
    const ontologyPath = './mm-profile-1.0.0.jsonld';
    const context = readJson(ontologyPath)['@context'];

    const rolesJsonLd = Object.entries(inputData).map(([role, details]) =>
        mapRoleToJSONLD(role, details, schema));

    return {
        "@context": context,
        "@graph": rolesJsonLd
    };
}

// Usage
const inputJson = './input.json';
const mappedJsonLd = mapRolesToJsonLd(inputJson);
const jsonLdString = JSON.stringify(mappedJsonLd, null, 2);
const outputPath = './output.jsonld';
fs.writeFileSync(outputPath, jsonLdString);
console.log(`The JSON-LD data has been saved to ${outputPath}`);

// import fs from 'fs';
//
// const inputJson = './input.json'
// function mapRolesToJsonLd(inputJson) {
//         function readJson(filePath) {
//         const fileData = fs.readFileSync(filePath, 'utf8');
//         return JSON.parse(fileData); // parse JSON string to JSON object
//     }
//     const inputData = readJson(inputJson)
//
//     const ontologyPath = './mm-profile-1.0.0.jsonld'
//
//     const context = readJson(ontologyPath)['@context']
//
//     console.log(context);
//
//     const outputJsonLd = {
//         "@context":
//             context,
//         "@graph": []
//     };
//
//     Object.entries(inputData).forEach(([role, details]) => {
//         const roleEntity = {
//             "@type": "Role",
//             "name": role,
//             "knowledges": details["Knowledges"].map(knowledge => ({
//                 "@id": knowledge
//             })),
//             "hardSkills": details["Hard Skills"].map(skill => ({
//                 "@id": skill
//             }))
//         };
//
//         outputJsonLd["@graph"].push(roleEntity);
//     });
//
//     return outputJsonLd;
// }
//
// const mappedJsonLd = mapRolesToJsonLd(inputJson);
// //console.log(JSON.stringify(mappedJsonLd, null, 2));
//
// const jsonLdString = JSON.stringify(mappedJsonLd, null, 2);
//
// const outputPath = './output.jsonld';
//
// fs.writeFileSync(outputPath, jsonLdString);
//
// console.log(`The JSON-LD data has been saved to ${outputPath}`);
