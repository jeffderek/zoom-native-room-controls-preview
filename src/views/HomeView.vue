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
                        <div class="header">{{ port.name }}</div>
                        <div v-for="method in port.methods" class="method">
                            <p>{{ method.name }}</p>
                            <div v-for="param in method.params">
                                <button class="btn-default">
                                    {{ param.name }}
                                </button>
                            </div>
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
    },
    computed: {
        exampleJson() {
            return exampleJson;
        },
        calculatedJson() {
            try {
                let json = JSON.parse(this.json);
                return json;
            } catch {
                return null;
            }
        },
    },
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

            .header {
            }
        }
    }
}
</style>
