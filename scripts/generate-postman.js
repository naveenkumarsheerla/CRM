const fs = require('fs');
const path = require('path');

const API_DIR = path.join(__dirname, '../app/api');
const OUTPUT_FILE = path.join(__dirname, '../postman_collection.json');

// Base structure of the Postman Collection
const collection = {
    info: {
        name: "CRM Dashboard API (Auto-Generated)",
        description: "Automatically generated API Collection for CRM Dashboard.",
        schema: "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
    },
    item: [],
    auth: {
        type: "bearer",
        bearer: [
            {
                key: "token",
                value: "{{bearerToken}}",
                type: "string"
            }
        ]
    },
    variable: [
        {
            key: "baseUrl",
            value: "http://localhost:3000",
            type: "string"
        },
        {
            key: "bearerToken",
            value: "",
            type: "string"
        }
    ]
};

// Helper to recursively find route.ts files
function findRoutes(dir, fileList = []) {
    const files = fs.readdirSync(dir);

    for (const file of files) {
        const filePath = path.join(dir, file);
        if (fs.statSync(filePath).isDirectory()) {
            // Ignore dynamic route folders with brackets for the basic generation, or handle them
            findRoutes(filePath, fileList);
        } else if (file === 'route.ts' || file === 'route.js') {
            fileList.push(filePath);
        }
    }

    return fileList;
}

// Map HTTP methods exported in the file
function getMethods(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const methods = [];
    if (content.includes('export async function GET') || content.includes('export function GET')) methods.push('GET');
    if (content.includes('export async function POST') || content.includes('export function POST')) methods.push('POST');
    if (content.includes('export async function PUT') || content.includes('export function PUT')) methods.push('PUT');
    if (content.includes('export async function PATCH') || content.includes('export function PATCH')) methods.push('PATCH');
    if (content.includes('export async function DELETE') || content.includes('export function DELETE')) methods.push('DELETE');
    return methods;
}

// Generate the items
const routeFiles = findRoutes(API_DIR);
const folderMap = new Map(); // Group by top-level API folder

routeFiles.forEach(filePath => {
    // Get the relative path from app/api
    const relativePath = path.relative(API_DIR, path.dirname(filePath)).replace(/\\/g, '/');
    const pathParts = relativePath.split('/');
    
    // Determine folder name (e.g., 'users' from 'users/[id]')
    const folderName = pathParts[0] === '' ? 'Root' : pathParts[0].charAt(0).toUpperCase() + pathParts[0].slice(1);
    
    const methods = getMethods(filePath);
    
    if (!folderMap.has(folderName)) {
        folderMap.set(folderName, {
            name: folderName,
            item: []
        });
    }

    const folder = folderMap.get(folderName);
    
    methods.forEach(method => {
        // Construct the URL path array
        const urlPath = ['api', ...pathParts].filter(p => p !== '');
        
        // Basic naming
        let reqName = `${method} ${relativePath || '/'}`;
        
        // Handle specific known cases for better naming
        if (relativePath === 'auth/login') reqName = 'Login';
        else if (method === 'GET' && relativePath.includes('[id]')) reqName = `Get ${folderName} By ID`;
        else if (method === 'GET') reqName = `Get All ${folderName}`;
        else if (method === 'POST') reqName = `Create ${folderName.replace(/s$/, '')}`; // basic singular
        else if (method === 'PUT' || method === 'PATCH') reqName = `Update ${folderName.replace(/s$/, '')}`;
        else if (method === 'DELETE') reqName = `Delete ${folderName.replace(/s$/, '')}`;
        
        const requestItem = {
            name: reqName,
            request: {
                method: method,
                header: [],
                url: {
                    raw: `{{baseUrl}}/api/${relativePath === '' ? '' : relativePath.replace(/\[([^\]]+)\]/g, ':$1')}`,
                    host: ["{{baseUrl}}"],
                    path: urlPath.map(p => p.replace(/\[([^\]]+)\]/g, ':$1')) // Replace [id] with :id for Postman variables
                }
            },
            response: []
        };

        // If it's the login route, add the test script to capture token
        if (relativePath === 'auth/login' && method === 'POST') {
            requestItem.event = [
                {
                    listen: "test",
                    script: {
                        exec: [
                            "var jsonData = pm.response.json();",
                            "if (jsonData.token) {",
                            "    pm.collectionVariables.set(\"bearerToken\", jsonData.token);",
                            "}"
                        ],
                        type: "text/javascript"
                    }
                }
            ];
            requestItem.request.auth = { type: "noauth" }; // Login shouldn't need bearer
            requestItem.request.body = {
                mode: "raw",
                raw: "{\n    \"email\": \"test@example.com\",\n    \"password\": \"password123\"\n}"
            };
            requestItem.request.header.push({ key: "Content-Type", value: "application/json" });
        }

        folder.item.push(requestItem);
    });
});

// Add folders to collection
for (const folder of folderMap.values()) {
    collection.item.push(folder);
}

// Write to file
fs.writeFileSync(OUTPUT_FILE, JSON.stringify(collection, null, 4));
console.log(`✅ Postman collection auto-generated at: ${OUTPUT_FILE}`);
