export interface ConfigBaseProps {
  logLevel: 'log' | 'info' | 'debug' | 'error';
}

const BaseConfig: ConfigBaseProps = {
  logLevel: 'info',
};

export default BaseConfig;
