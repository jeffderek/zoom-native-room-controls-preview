<template>
    <div id="preview-frame">
        <div
            id="json-entry"
            class="split">
            <textarea
                id="json-textarea"
                v-model="json"></textarea>
            <div
                id="zoom-output"
                v-if="target">
                <p class="zoom-output-label">Target:</p>
                <p
                    class="zoom-output-content"
                    id="zoom-output-target">
                    {{ target }}
                </p>
                <p class="zoom-output-label">Command:</p>
                <p
                    class="zoom-output-content"
                    id="zoom-output-command">
                    {{ command }}
                </p>
            </div>
        </div>
        <div
            id="preview"
            class="split">
            <div
                id="zoom-controls"
                v-if="calculatedControls != null">
                <template v-for="adapter in calculatedControls.adapters">
                    <div
                        v-for="port in adapter.ports"
                        class="port">
                        <div class="header method">
                            <div class="method-label">
                                <span
                                    v-if="port.icon && port.icon.startsWith('mdi:')"
                                    :class="getMaterialIconClass(port.icon)"
                                    >{{ getMaterialIconName(port.icon) }}</span
                                >

                                <img
                                    v-else-if="port.icon"
                                    :src="getIconUrl(port.icon)" />
                                <p>{{ port.name }}</p>
                            </div>
                            <div v-if="port.main_method">
                                <template v-if="port.main_method.params">
                                    <div class="button-group">
                                        <div
                                            v-for="param in port.main_method.params">
                                            <button
                                                class="btn-zoom"
                                                :class="{
                                                    'btn-rectangle': param.icon == null,
                                                    'btn-circle': param.icon != null,
                                                }"
                                                @click="zoomClick(adapter, port, port.main_method, param)">
                                                <p v-if="!param.icon">
                                                    {{ param.name }}
                                                </p>
                                                <span
                                                    v-else-if="param.icon && param.icon.startsWith('mdi:')"
                                                    :class="getMaterialIconClass(param.icon)"
                                                    >{{ getMaterialIconName(param.icon) }}</span
                                                >
                                                <img
                                                    v-else
                                                    :src="getIconUrl(param.icon)" />
                                            </button>
                                        </div>
                                    </div>
                                </template>
                                <template v-else>
                                    <button
                                        class="btn-zoom"
                                        :class="{
                                            'btn-rectangle': port.main_method.icon == null,
                                            'btn-circle': port.main_method.icon != null,
                                        }"
                                        @click="zoomClick(adapter, port, port.main_method)">
                                        <p v-if="!port.main_method.icon">
                                            {{ port.main_method.name }}
                                        </p>
                                        <span
                                            v-if="port.main_method.icon && port.main_method.icon.startsWith('mdi:')"
                                            :class="getMaterialIconClass(port.main_method.icon)"
                                            >{{ getMaterialIconName(port.main_method.icon) }}</span
                                        >
                                        <img
                                            v-else
                                            :src="getIconUrl(port.main_method.icon)" />
                                    </button>
                                </template>
                            </div>
                        </div>
                        <template v-if="!port.showOnlyMainMethod">
                            <div class="divider"></div>
                            <template v-for="method in port.methods">
                                <div
                                    v-if="method.visible == true"
                                    class="method">
                                    <div class="method-label">
                                        <span
                                            v-if="method.icon && method.icon.startsWith('mdi:')"
                                            :class="getMaterialIconClass(method.icon)"
                                            >{{ getMaterialIconName(method.icon) }}</span
                                        >
                                        <img
                                            v-else-if="method.icon"
                                            :src="getIconUrl(method.icon)" />
                                        <p>{{ method.name }}</p>
                                    </div>
                                    <div
                                        class="button-group"
                                        v-if="method.params">
                                        <div v-for="param in method.params">
                                            <button
                                                class="btn-zoom"
                                                :class="{
                                                    'btn-rectangle': param.icon == null,
                                                    'btn-circle': param.icon != null,
                                                }"
                                                @click="zoomClick(adapter, port, method, param)">
                                                <p v-if="!param.icon">
                                                    {{ param.name }}
                                                </p>
                                                <span
                                                    v-else-if="param.icon && param.icon.startsWith('mdi:')"
                                                    :class="getMaterialIconClass(param.icon)"
                                                    >{{ getMaterialIconName(param.icon) }}</span
                                                >
                                                <img
                                                    v-else
                                                    :src="getIconUrl(param.icon)" />
                                            </button>
                                        </div>
                                    </div>
                                    <div v-else>
                                        <button
                                            class="btn-zoom"
                                            :class="{
                                                'btn-rectangle': method.icon == null,
                                                'btn-circle': method.icon != null,
                                            }"
                                            @click="zoomClick(adapter, port, method)">
                                            <p v-if="!method.icon">
                                                {{ method.name }}
                                            </p>
                                            <span
                                                v-else-if="method.icon && method.icon.startsWith('mdi:')"
                                                :class="getMaterialIconClass(method.icon)"
                                                >{{ getMaterialIconName(method.icon) }}</span
                                            >
                                            <img
                                                v-else
                                                :src="getIconUrl(method.icon)" />
                                        </button>
                                    </div>
                                </div>
                            </template>
                        </template>
                    </div>
                </template>
            </div>
            <div
                v-else
                id="json-invalid">
                <h1>Error</h1>
                <p>{{ errorMessage }}</p>
            </div>
        </div>
    </div>
</template>

<script>
import exampleJson from '@/assets/example.json';

export default {
    name: 'HomeView',
    data: () => ({
        json: JSON.stringify(exampleJson, null, 2),
        errorMessage: '',
        target: '',
        command: '',
    }),
    methods: {
        getIconUrl(iconName) {
            var icons = require.context('@/assets/zoom_icons/dark/', true, /\.png$/);

            try {
                return icons('./' + iconName + '.png');
            } catch {
                return icons('./icon_alert.png');
            }
        },
        getMaterialIconName(iconName) {
            if (iconName)
        {
            const parts = iconName.split(':');
            if (parts.length > 1)
            {
                return parts[1];
            }
            else return "";

        }
        },
        getMaterialIconClass(iconName) {
            if (iconName)
        {
            const parts = iconName.split(':');
            if (parts.length > 2) {
                switch (parts[2]) {
                    case 'outlined':
                        return `material-icons-outlined`;
                    case 'rounded':
                        return `material-icons-round`;
                    case 'sharp':
                        return `material-icons-sharp`;
                    case 'two_tone':
                        return `material-icons-two-tone`;
                    case 'filled':
                    default:
                        return `material-icons`;
                }
            } else {
                return `material-icons`
            }
        }
        },
        zoomClick(adapter, port, method, param) {
            this.target = port.id;

            if (adapter.model == 'iTachIP2CC') {
                this.command = `Relay ${param.position} ${param.name}`;
            } else {
                this.command = method.command;
                if (method.type == 'actions') {
                    this.command = this.command.replace('%', param.value);
                }
            }
        },
    },
    computed: {
        exampleJson() {
            return exampleJson;
        },
        calculatedControls() {
            try {
                let json;
                try{
                    json = JSON.parse(this.json);
                }
                catch {
                    throw new Error("JSON Parsing Failed");
                }

                // Zoom automatically adds On/Off methods for the iTachIP2CC, so we have to add them
                // as well if we want them to render.
                json.adapters
                    .filter((adapter) => adapter.model == 'iTachIP2CC')
                    .forEach((adapter) => {
                        adapter.ports.forEach((port) => {
                            port.methods = [
                                {
                                    name: 'Power',
                                    id: 'power',
                                    params: [
                                        { name: 'On', id: 'on', position: port.position },
                                        { name: 'Off', id: 'off', position: port.position },
                                    ],
                                },
                            ];

                            // The autogenerated method is treated like a main method.  Instead of manually
                            // handling that here, we just add the main_method style and let it get handled
                            // with all of the other main methods.
                            json.styles.push(port.id + '.main_method=power');
                        });
                    });

                // Take the information in the styles array and use it to populate the adapters array with
                // information to better style things inline.  This makes for a clunkier object but does all
                // of our processing once when handling a change to the json and makes the html rendering above much easier.

                if (json.styles) {
                    if (json.styles.length == 0) {
                        return null;
                    }

                    json.styles.forEach((style) => {
                        // Break up the style into component parts
                        if (!style.includes('..')) {
                            let regex =
                                /^(?<port>[^.=]*)\.?(?<method>[^.=]*)\.?(?<param>[^.=]*)\.(?<style>[^.=]*)=(?<value>.*)$/;
                            let result = regex.exec(style);

                            // Verify that the port referenced in the style actually exists
                            let port;
                            json.adapters.find((adapter) => {
                                let foundPort = adapter.ports.find((port) => port.id == result.groups.port);
                                if (foundPort) {
                                    port = foundPort;
                                    return true;
                                } else {
                                    return false;
                                }
                            });

                            if (port) {
                                // Different styles get handled differently
                                switch (result.groups.style) {
                                    case 'icon': {
                                        // Add a new icon param to the json inline where it is necessary.
                                        let icon = result.groups.value;

                                        if (result.groups.method) {
                                            let method = port.methods.find(
                                                (method) => method.id == result.groups.method
                                            );

                                            if (result.groups.param) {
                                                let param = method.params.find(
                                                    (param) => param.id == result.groups.param
                                                );
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
                                        // Create a new main_method param to the json inline, which
                                        // makes it easier to render the main method
                                        port.main_method = port.methods.find(
                                            (method) => method.id == result.groups.value
                                        );
                                        break;
                                    }
                                    case 'invisible': {
                                        // At this point no methods will have a visible param.
                                        // This creates a new visible param and sets it to false if
                                        // the style says it should be invisible.
                                        if (!result.groups.param) {
                                            port.methods.find((method) => method.id == result.groups.method).visible =
                                                result.groups.value != 'true';
                                        }
                                        break;
                                    }
                                }
                            }
                        }
                    });
                }

                // Loop through all adapters for the last few parameters that need to be set.
                json.adapters.forEach((adapter) => {
                    adapter.ports.forEach((port) => {
                        // Identify whether a device should show only the main method or if there should be additional methods shown
                        // This will get used to determine whether the divider between the header and other methods is shown
                        if (port.main_method && port.methods.length == 1) {
                            port.showOnlyMainMethod = true;
                        } else {
                            port.showOnlyMainMethod = false;
                        }

                        // If visibility hasn't already been set to false by styles, evaluate visibility for other reasons
                        port.methods.forEach((method) => {
                            // The main_method only gets rendered in the header, and gets hidden among the other methods
                            if (port.main_method) {
                                if (method.id == port.main_method.id) {
                                    method.visible = false;
                                }
                            }

                            // If the method still hasn't been set to invisible, set it to visible.
                            if (method.visible != false) {
                                method.visible = true;
                            }
                        });
                    });
                });

                // Zoom has a bug where an empty rule needs to be fully empty or the json fails to load, even if it is proper json.
                // "meeting_started": [] works
                // "meeting_started": [ ] will fail
                // "meeting_started": [
                // ] will fail
                if (json.rules)
                {
                    Object.keys(json.rules).forEach((rule) => {
                        if(json.rules[rule].length == 0)
                        {
                            let regex = new RegExp("\"rules\"(.|\n)*\"" + rule + "\": \\[\\]");
                            let result = regex.test(this.json);
                            if (!result)
                            {
                                throw new Error("Empty rules must be truly empty (Nothing between square brackets [])")
                            }
                        }
                    })
                }

                return json;
            } catch (e) {
                console.log(e.message)
                this.errorMessage = e.message
                // Returning null here will cause the entire preview to not render
                return null;
            }
        },
    },
};
</script>

<style lang="scss">
$zoom-panel-width: 666px;
$zoom-button-height: 58px;

#preview-frame {
    display: flex;
    flex-direction: row;
    align-items: flex-start;
    justify-content: center;
    height: 100%;
    gap: 1rem;

    .split {
        height: 100%;
        flex: 1;
    }

    #json-entry {
        display: flex;
        flex-direction: column;
        gap: 1rem;

        textarea {
            flex: 1;
            border: 1px solid $color-border;
        }

        #zoom-output {
            border: 1px solid $color-border;
            background: #fff;
            display: grid;
            grid-template-columns: min-content auto;

            .zoom-output-label {
                font-weight: bold;
                font-size: 1rem;
            }

            .zoom-output-content {
                text-align: left;
                width: 100%;
                font-size: 1rem;
            }
        }
    }
    #preview {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: flex-start;
        overflow: auto;

        #json-invalid {
            width: 100%;
            background: $color-error;
            color: $color-text-light;
            text-align: center;
            padding: 1rem;

            h1 {
                font-size: 1.5rem;
            }
        }

        #zoom-controls {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: flex-start;
            gap: 1rem;
            width: $zoom-panel-width;

            .port {
                border-radius: 10px;
                background: $color-zoom-port-background;
                padding: 0px 30px;
                font-size: 19px;
                width: 100%;

                .header {
                    font-weight: bold;
                }

                .divider {
                    height: 1px;
                    background: $color-zoom-button;
                }

                .method {
                    padding: 22px 0px;
                    display: flex;
                    flex-direction: row;
                    align-items: flex-start;
                    justify-content: space-between;
                    gap: 1rem;
                }

                .method-label {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: space-between;
                    gap: 1rem;
                    white-space: nowrap;
                    height: $zoom-button-height;
                }

                .button-group {
                    display: flex;
                    flex-direction: row;
                    align-items: center;
                    justify-content: flex-end;
                    gap: 1rem;
                    flex-wrap: wrap;
                }

                .btn-zoom {
                    @extend %btn-shared;

                    // Border
                    border: none;

                    // Text
                    font-size: 20px;

                    // Colors
                    background-color: $color-zoom-button;
                    color: $color-text-dark;

                    &:active {
                        background: darken($color-zoom-button, 10);
                    }

                    &.btn-circle {
                        // Border
                        border-radius: 50%;

                        // Size
                        padding: 0px;
                        width: $zoom-button-height;
                        height: $zoom-button-height;

                        display: flex;
                        align-items: center;
                        justify-content: center;
                    }

                    &.btn-rectangle {
                        // Border
                        border-radius: 12px;

                        // Size
                        padding: 0 22px;
                        min-width: 93px;
                        height: $zoom-button-height;
                    }
                }
            }
        }
    }
}
</style>
