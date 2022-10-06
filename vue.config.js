module.exports = {
    publicPath: '',
    devServer: {
        host: 'localhost',
        open: {
            app: {
                name: 'chrome',
            },
        },
    },
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                @import "@/styles/imports/_colors.scss";
                @import "@/styles/imports/_fonts.scss";
                @import "@/styles/imports/_classes.scss";
            `,
            },
        },
    },
};
