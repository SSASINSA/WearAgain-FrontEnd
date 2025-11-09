import {ApplicationSummary} from '../screens/applications/types';

export type ApplicationsStackParamList = {
  ApplicationList: undefined;
  ApplicationDetail: {
    applicationId: string;
    initialData?: ApplicationSummary;
  };
};
