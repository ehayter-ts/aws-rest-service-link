import '@k2oss/k2-broker-core';

metadata = {
    systemName: "AWS_API",
    displayName: "AWS API Broker",
    description: "AWS API Broker"
};

ondescribe = async function({configuration}): Promise<void> {
    postSchema({
        objects: {
            "pet": {
                displayName: "Pet",
                description: "Manages a pets list",
                properties: {
                    "id": {
                        displayName: "ID",
                        type: "number"
                    },
                    "type": {
                        displayName: "Type",
                        type: "string"
                    },
                    "price": {
                        displayName: "Price",
                        type: "decimal"
                    }
                },
                methods: {
                    "get": {
                        displayName: "Get Pets",
                        type: "list",
                        inputs: [],
                        outputs: [ "id", "type", "price" ]
                    }
                }
            }
        }
    });
}

onexecute = async function({objectName, methodName, parameters, properties, configuration, schema}): Promise<void> {
    switch (objectName)
    {
        case "pet": await onexecuteTodo(methodName, properties, parameters); break;
        default: throw new Error("The object " + objectName + " is not supported.");
    }
}

async function onexecuteTodo(methodName: string, properties: SingleRecord, parameters: SingleRecord): Promise<void> {
    switch (methodName)
    {
        case "get": await onexecuteTodoGet(properties); break;
        default: throw new Error("The method " + methodName + " is not supported.");
    }
}

function onexecuteTodoGet(properties: SingleRecord): Promise<void> {
    return new Promise<void>((resolve, reject) =>
    {
        var xhr = new XMLHttpRequest();
        xhr.onreadystatechange = function() {
            try {
                if (xhr.readyState !== 4) return;
                if (xhr.status !== 200) throw new Error("Failed with status " + xhr.status);

                var arrayObj = JSON.parse(xhr.responseText);
                postResult(arrayObj.map(x => {
                    return {
                        "id": x.id,
                        "type": x.type,
                        "price": x.price
                    }
                }));
                resolve();
            } catch (e) {
                reject(e);
            }
        };
        
        if(typeof properties["id"] !== "number") throw new Error("properties[\"id\"] is not of type number");
        xhr.open("GET", 'https://petstore.execute-api.eu-west-2.amazonaws.com/petstore/pets');
        xhr.setRequestHeader('test', 'test value');
        xhr.send();
    });
}