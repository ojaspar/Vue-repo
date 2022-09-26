module.exports = {
    pwa: {
        name: 'Mzuri',
        workboxOptions: {
            skipWaiting: true,
            clientsClaim: true,
        },
    },
    css: {
        loaderOptions: {
            sass: {
                additionalData: `
                  @import "@/styles/abstracts/variables.scss";
                  @import "@/styles/abstracts/mixins.scss";
                  @import './node_modules/bootstrap/scss/functions';
                  @import './node_modules/bootstrap/scss/variables';
                  @import './node_modules/bootstrap/scss/mixins/_breakpoints';
                `,
            },
        },
    },
};
