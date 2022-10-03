<template>
    <nav>
        <img id="logo" src="@/assets/logo.png" />
        <div id="links">
            <router-link class="link" to="/">Home</router-link>
            <router-link class="link" to="/about">About</router-link>
        </div>
    </nav>
    <main>
        <router-view />
    </main>
</template>

<style lang="scss">
@import './styles/style.scss';

#app {
    height: 100%;
    width: 100%;

    display: flex;
    flex-direction: column;
}

nav {
    background: $color-primary;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    flex-basis: 60px;
    height: 60px;

    #logo {
        height: 100%;
        padding: 8px;
    }

    #links {
        height: 100%;
        display: flex;
        flex-direction: row;
        align-items: flex-end;
        justify-content: center;
        margin-right: 1rem;
        margin-top: 1rem;
        gap: 1rem;

        .link {
            font-weight: bold;
            font-size: 1.3rem;
            color: $color-white;
            line-height: 100%;
            border-radius: 5px 5px 0 0;
            padding: 8px;
            height: 100%;

            &.router-link-exact-active {
                color: $color-primary;
                background-color: $color-white;
            }
        }
    }
}

main {
    flex: 1;
}
</style>
