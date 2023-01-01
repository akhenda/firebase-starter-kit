import BaseConfig from './config.base';
import DevConfig from './config.dev';
import ProdConfig from './config.prod';
import { IS_DEV } from './constants';

let ExtraConfig = ProdConfig;

if (IS_DEV) ExtraConfig = DevConfig;

const Config = { ...BaseConfig, ...ExtraConfig };

export default Config;
