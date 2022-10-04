<template>
    <div id="preview-frame">
        <div id="json-entry" class="split">
            <textarea name="json" id="json-textarea" v-model="json"></textarea>
            <button class="btn-default" @click="preview">Submit</button>
        </div>
        <div id="preview" class="split">
            <template v-if="calculatedJson != null">
                <div v-for="adapter in calculatedJson.adapters">
                    {{ adapter.model }}
                    <div v-for="port in adapter.ports" class="port">
                        <div class="header two-columns-flex">
                            <p>{{ port.name }}</p>
                            <div v-if="getMainMethod(adapter.model, port.id)">
                                <button class="btn-default">
                                    {{
                                        getMainMethod(adapter.model, port.id)
                                            .name
                                    }}
                                </button>
                            </div>
                        </div>
                        <div
                            v-for="method in port.methods"
                            class="method two-columns-flex"
                        >
                            <template v-if="method.type == 'actions'">
                                <p>{{ method.name }}</p>
                                <div class="param">
                                    <div v-for="param in method.params">
                                        <button class="btn-default">
                                            {{ param.name }}
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </div>
                    </div>
                </div>
            </template>
            <div v-else id="json-invalid">JSON Is Not Valid</div>
        </div>
    </div>
</template>

<script>
import exampleJson from '@/assets/example.json';

export default {
    name: 'HomeView',
    data: () => ({
        json: JSON.stringify(exampleJson),
        jsonObject: null,
    }),
    methods: {
        preview() {
            try {
                let json = JSON.parse(this.json);
                console.log(json);
                this.jsonObject = json;
            } catch {
                this.jsonObject = null;
                console.log('not valid json');
            }
        },
        getMainMethod(model, portId) {
            let search = portId + '.main_method=';
            let style = this.calculatedJson.styles.find((style) =>
                style.startsWith(search)
            );
            if (style) {
                let methodId = style.substr(search.length);
                let adapter = this.calculatedJson.adapters.find(
                    (adapter) => adapter.model == model
                );
                if (adapter) {
                    let port = adapter.ports.find((port) => port.id == portId);
                    if (port) {
                        let method = port.methods.find(
                            (method) => method.id == methodId
                        );
                        return method;
                    } else return null;
                } else return null;
            } else return null;
        },
    },
    computed: {
        exampleJson() {
            return exampleJson;
        },
        calculatedJson() {
            try {
                let json = JSON.parse(this.json);

                // Zoom automatically adds On/Off methods for the iTachIP2CC
                json.adapters
                    .filter((adapter) => adapter.model == 'iTachIP2CC')
                    .forEach((adapter) => {
                        adapter.ports.forEach((port) => {
                            // TODO Add Params to the default power method so you get On/Off
                            let defaultPowerMethods = [
                                { name: 'Power', id: 'power' },
                            ];
                            port.methods = defaultPowerMethods;
                            json.styles.push(port.id + '.main_method=power');
                        });
                    });

                return json;
            } catch {
                return null;
            }
        },
    },
    mounted() {},
};
</script>

<style lang="scss">
#preview-frame {
    display: flex;
    flex-direction: row;
    height: 100%;

    .split {
        height: 100%;
        flex: 1;
        padding: 1rem;
    }

    #json-entry {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        textarea {
            flex: 1;
        }

        button {
            margin: 0;
        }
    }
    #preview {
        #json-invalid {
            width: 100%;
            background: $color-red;
            color: $color-white;
            text-align: center;
            padding: 1rem;
            font-size: 1.3rem;
        }

        .port {
            border: solid 1px $color-border;
            border-radius: 5px;

            .two-columns-flex {
                display: flex;
                flex-direction: row;
                align-items: center;
                justify-content: space-between;
            }

            .header {
            }

            .method {
                .param {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                }
            }
        }
    }
}
</style>
