import { useTimeAtWork } from './useTimeAtWork';
import { useMyActions } from './useMyActions';
import { useEmployeesOnLeave } from './useEmployeesOnLeave';
import { useEmployeeDistribution } from './useEmployeeDistribution';
import { useBuzzPosts } from './useBuzzPosts';

export const useDashboard = () => {
  const timeAtWork = useTimeAtWork();
  const myActions = useMyActions();
  const employeesOnLeave = useEmployeesOnLeave();
  const employeeDistribution = useEmployeeDistribution();
  const buzzPosts = useBuzzPosts();

  const refetchAll = () => {
    timeAtWork.refetch();
    myActions.refetch();
    employeesOnLeave.refetch();
    employeeDistribution.refetch();
    buzzPosts.refetch();
  };

  return {
    timeAtWork,
    myActions,
    employeesOnLeave,
    employeeDistribution,
    buzzPosts,
    refetchAll,
  };
};

