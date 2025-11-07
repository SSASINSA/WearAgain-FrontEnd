import {ApplicationHistory} from '../screens/applications/types';

export type ApplicationsStackParamList = {
  ApplicationList: undefined;
  ApplicationDetail: {
    application: ApplicationHistory;
  };
};
