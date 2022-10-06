<template>
    <div id="preview-frame">
        <div id="json-entry" class="split">
            <textarea name="json" id="json-textarea" v-model="json"></textarea>
        </div>
        <div id="preview" class="split">
            <div id="zoom-controls" v-if="calculatedJson != null">
                <template v-for="adapter in calculatedJson.adapters">
                    <div v-for="port in adapter.ports" class="port">
                        <div class="header button-group">
                            <div class="button-group">
                                <img
                                    v-if="port.icon"
                                    :src="getIconUrl(port.icon)"
                                />
                                <p>{{ port.name }}</p>
                            </div>
                            <div v-if="port.main_method">
                                <template v-if="port.main_method.params">
                                    <div class="button-group">
                                        <div
                                            v-for="param in port.main_method
                                                .params"
                                        >
                                            <button
                                                class="btn-default"
                                                :class="{
                                                    'btn-rectangle':
                                                        param.icon == null,
                                                    'btn-circle':
                                                        param.icon != null,
                                                }"
                                            >
                                                <p v-if="!param.icon">
                                                    {{ param.name }}
                                                </p>
                                                <img
                                                    v-else
                                                    :src="
                                                        getIconUrl(param.icon)
                                                    "
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <button
                                        class="btn-default"
                                        :class="{
                                            'btn-rectangle':
                                                port.main_method.icon == null,
                                            'btn-circle':
                                                port.main_method.icon != null,
                                        }"
                                    >
                                        <p v-if="!port.main_method.icon">
                                            {{ port.main_method.name }}
                                        </p>
                                        <img
                                            v-else
                                            :src="
                                                getIconUrl(
                                                    port.main_method.icon
                                                )
                                            "
                                        />
                                    </button>
                                </template>
                            </div>
                        </div>
                        <template v-if="!port.showOnlyMainMethod">
                            <div class="divider"></div>
                            <template v-for="method in port.methods">
                                <div
                                    v-if="method.visible == true"
                                    class="method button-group"
                                >
                                    <div class="button-group">
                                        <img
                                            v-if="method.icon"
                                            :src="getIconUrl(method.icon)"
                                        />
                                        <p>{{ method.name }}</p>
                                    </div>
                                    <div
                                        class="button-group"
                                        v-if="method.params"
                                    >
                                        <div v-for="param in method.params">
                                            <button
                                                class="btn-default"
                                                :class="{
                                                    'btn-rectangle':
                                                        param.icon == null,
                                                    'btn-circle':
                                                        param.icon != null,
                                                }"
                                            >
                                                <p v-if="!param.icon">
                                                    {{ param.name }}
                                                </p>
                                                <img
                                                    v-else
                                                    :src="
                                                        getIconUrl(param.icon)
                                                    "
                                                />
                                            </button>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <button
                                            class="btn-default"
                                            :class="{
                                                'btn-rectangle':
                                                    method.icon == null,
                                                'btn-circle':
                                                    method.icon != null,
                                            }"
                                        >
                                            <p v-if="!method.icon">
                                                {{ method.name }}
                                            </p>
                                            <img
                                                v-else
                                                :src="getIconUrl(method.icon)"
                                            />
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                </template>
            </div>
            <div v-else id="json-invalid">JSON Is Not Valid</div>
        </div>
    </div>
</template>

<script>
import exampleJson from '@/assets/example.json';

export default {
    name: 'HomeView',
    data: () => ({
        json: JSON.stringify(exampleJson, null, 2),
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
        getIconUrl(iconName) {
            var icons = require.context(
                '@/assets/zoom_icons/dark/',
                true,
                /\.png$/
            );

            try {
                return icons('./icon_' + iconName + '.png');
            } catch {
                return icons('./icon_alert.png');
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

                // Zoom automatically adds On/Off methods for the iTachIP2CC
                json.adapters
                    .filter((adapter) => adapter.model == 'iTachIP2CC')
                    .forEach((adapter) => {
                        adapter.ports.forEach((port) => {
                            // TODO Add Params to the default power method so you get On/Off
                            let defaultPowerMethods = [
                                {
                                    name: 'Power',
                                    id: 'power',
                                    params: [
                                        { name: 'On', id: 'on' },
                                        { name: 'Off', id: 'off' },
                                    ],
                                },
                            ];
                            port.methods = defaultPowerMethods;
                            json.styles.push(port.id + '.main_method=power');
                        });
                    });

                // Take the information in the styles array and use it to populate the adapters array with
                // information to better style things inline.
                json.styles.forEach((style) => {
                    console.log(style);
                    let regex =
                        /^(?<port>[^.=]*)\.?(?<method>[^.=]*)\.?(?<param>[^.=]*)\.(?<style>[^.=]*)=(?<value>.*)$/;
                    let result = regex.exec(style);

                    let port;
                    json.adapters.find((adapter) => {
                        let foundPort = adapter.ports.find(
                            (port) => port.id == result.groups.port
                        );
                        if (foundPort) {
                            port = foundPort;
                            return true;
                        } else {
                            return false;
                        }
                    });

                    if (port) {
                        switch (result.groups.style) {
                            case 'icon': {
                                // Find the port on whichever adapter it is on
                                let icon = result.groups.value.substring(5);

                                if (result.groups.method) {
                                    let method = port.methods.find(
                                        (method) =>
                                            method.id == result.groups.method
                                    );

                                    if (result.groups.param) {
                                        let param = method.params.find(
                                            (param) =>
                                                param.id == result.groups.param
                                        );
                                        console.log(param);
                                        param.icon = icon;
                                    } else {
                                        method.icon = icon;
                                    }
                                } else {
                                    port.icon = icon;
                                }
                                break;
                            }
                            case 'main_method': {
                                port.main_method = port.methods.find(
                                    (method) => method.id == result.groups.value
                                );
                                break;
                            }
                            case 'invisible': {
                                port.methods.find(
                                    (method) =>
                                        method.id == result.groups.method
                                ).visible = result.groups.value != 'true';
                                break;
                            }
                        }
                    }
                });

                // Identify whether a device should show only the main method or if there should be additional methods shown

                json.adapters.forEach((adapter) => {
                    adapter.ports.forEach((port) => {
                        if (port.main_method && port.methods.length == 1) {
                            port.showOnlyMainMethod = true;
                        } else {
                            port.showOnlyMainMethod = false;
                        }

                        port.methods.forEach((method) => {
                            // If visibility hasn't already been set to false by styles, evaluate visibility for other reasons
                            if (method.visible != false) {
                                if (port.main_method) {
                                    if (method.id == port.main_method.id) {
                                        method.visible = false;
                                    }
                                }

                                if (method.visible != false) {
                                    method.visible = true;
                                }
                            }
                        });
                    });
                });

                console.log(json);
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
    }
    #preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;

        #json-invalid {
            width: 100%;
            background: $color-red;
            color: $color-white;
            text-align: center;
            padding: 1rem;
            font-size: 1.3rem;
        }

        #zoom-controls {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            gap: 1rem;
            width: 666px;

            .port {
                //border: solid 1px $color-border;
                border-radius: 10px;
                background: $color-white;
                padding: 0px 18px;
                font-size: 19px;
                width: 100%;

                & > * {
                    //margin: 22px 0;
                }

                *:last-child {
                    //margin-bottom: 0px;
                }

                .button-group {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                }

                .header {
                    font-weight: bold;
                    padding: 22px 0px;
                }

                .divider {
                    height: 1px;
                    background: $color-zoom-button;
                }

                .method {
                    padding: 22px 0px;
                }
            }
        }
    }
}
</style>
