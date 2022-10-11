module.exports = {
    devServer: {
        open: 'chrome',
    },
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                @import "@/styles/imports/_colors.scss";
                @import "@/styles/imports/_buttons.scss";
            `,
            },
        },
    },
};
