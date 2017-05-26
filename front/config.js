const IS_PROD = process.env.NODE_ENV === 'production';

const WDS_PORT = 3001;

const DEV_HOST = process.env.DEV_HOST ? process.env.DEV_HOST : 'localhost';

const SCRIPT_PATH = IS_PROD ? '/dist/' : `http://${DEV_HOST}:${WDS_PORT}/dist/`;

module.exports = {
    IS_PROD,
    WDS_PORT,
    DEV_HOST,
    SCRIPT_PATH
};
