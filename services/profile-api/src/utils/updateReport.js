export const updateReport = async (requestContext) => {
  const addedMissionQueries =
    requestContext.operation.selectionSet.selections.filter(
      (s) => s.name.value === "createMission",
    );
  const addedUserQueries =
    requestContext.operation.selectionSet.selections.filter(
      (s) => s.name.value === "createUser",
    );

  if (!addedMissionQueries.length && !addedUserQueries.length) {
    return;
  }

  const dataLoader = requestContext.contextValue.dataLoader;
  const today = new Date();
  const reportTime = `${today.getUTCFullYear()}-${
    today.getUTCMonth() + 1
  }-${today.getUTCDate()}`;
  const reportId = `Report-${reportTime}`;

  const report = (await dataLoader.getByIds([reportId]))?.[0];
  const updatedReport = {
    id: reportId,
    type: ["skos:Report"],
    report_time__value: reportTime,
  };
  const requestVariables = requestContext.request.variables;

  // Get total missions created
  let newMissionsAdded = Number(report?.missionsAdded?.[0]?.value ?? 0);
  for (let i = 0; i < addedMissionQueries.length; i++) {
    const addedMissionQuery = addedMissionQueries[i];
    const addedMissionArgumentName = addedMissionQuery.arguments.find(
      (a) => a.name.value === "input",
    )?.value?.name?.value;
    if (requestVariables?.[addedMissionArgumentName]) {
      newMissionsAdded +=
        requestVariables?.[addedMissionArgumentName]?.bulk?.length ??
        (requestVariables?.[addedMissionArgumentName]?.data ? 1 : 0);
    }
  }
  if (newMissionsAdded) {
    updatedReport.missions_added__value = String(newMissionsAdded);
  }

  // Get total users created
  let newUsersAdded = Number(report?.profilesCreated?.[0]?.value ?? 0);
  for (let i = 0; i < addedUserQueries.length; i++) {
    const addedUserQuery = addedUserQueries[i];
    const addedUserArgumentName = addedUserQuery.arguments.find(
      (a) => a.name.value === "input",
    )?.value?.name?.value;
    if (requestVariables?.[addedUserArgumentName]) {
      newUsersAdded +=
        requestVariables?.[addedUserArgumentName]?.bulk?.length ??
        (requestVariables?.[addedUserArgumentName]?.data ? 1 : 0);
    }
  }
  const isNewReport = !Object.keys(report ?? {}).length;
  if (newUsersAdded || newMissionsAdded) {
    if (isNewReport) {
      await dataLoader.addDocuments([updatedReport]);
    } else {
      await dataLoader.updateDocuments([updatedReport]);
    }
  }

  // throw new Error("test");
};
