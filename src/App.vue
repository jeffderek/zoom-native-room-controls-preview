<template>
    <nav>
        <img
            id="logo"
            src="@/assets/logo.png" />
        <div id="links">
            <router-link
                class="link"
                to="/"
                >Home</router-link
            >
            <router-link
                class="link"
                to="/about"
                >About</router-link
            >
        </div>
    </nav>
    <main>
        <router-view />
    </main>
</template>

<style lang="scss">
@import './styles/style.scss';

$navbar-height: 60px;

#app {
    height: 100%;
    width: 100%;

    nav {
        position: fixed;
        left: 0;
        right: 0;
        top: 0;
        height: $navbar-height;
        z-index: 1;
        overflow-y: hidden;

        background: $color-primary;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-between;

        #logo {
            padding: 8px;
        }

        #links {
            height: $navbar-height;
            display: flex;
            flex-direction: row;
            align-items: flex-end;
            justify-content: center;
            padding-right: 1rem;
            padding-top: 1rem;
            gap: 1rem;

            .link {
                font-weight: bold;
                font-size: 1.3rem;
                color: $color-text-light;
                line-height: 100%;
                border-radius: 5px 5px 0 0;
                padding: 8px;
                height: 100%;

                &.router-link-exact-active {
                    color: $color-primary;
                    background-color: $color-background;
                }
            }
        }
    }

    main {
        height: 100%;
        padding: 16px;
        padding-top: ($navbar-height + 16px);
    }
}
</style>
