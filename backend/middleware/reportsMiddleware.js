const {
standardsDepartmentWiseReport,
standardsCategoryWiseReport,
standardsAmendmentsReport,
// Periodicals
periodicalsYearWiseReport,
periodicalsFrequencyWiseReport,
periodicalsMissingIssuesReport,
// Abstracts
abstractsDepartmentWiseReport,
abstractsYearWiseReport,
abstractsKeywordAnalysisReport,
// KC Members
kcMembersCompleteReport,
kcMembersPaymentStatusReport,
kcMembersOverdueReport,
kcMembersSubscriptionAnalysisReport,
kcMembersUpcomingRenewalsReport,
kcMembersPrintAddressLabelsReport,

arrivalsNewsCategoryWiseReport,
arrivalsNewsTypeWiseReport,
arrivalsNewsPriorityWiseReport,
arrivalsNewsStatusWiseReport,
arrivalsNewsCompleteReport
} = require('../controllers/reportController');

module.exports = {
  standardsDepartmentWiseReport,
  standardsCategoryWiseReport,
  standardsAmendmentsReport,

  periodicalsYearWiseReport,
  periodicalsFrequencyWiseReport,
  periodicalsMissingIssuesReport,

  abstractsDepartmentWiseReport,
  abstractsYearWiseReport,
  abstractsKeywordAnalysisReport,

  kcMembersCompleteReport,
  kcMembersPaymentStatusReport,
  kcMembersOverdueReport,
  kcMembersSubscriptionAnalysisReport,
  kcMembersUpcomingRenewalsReport,
  kcMembersPrintAddressLabelsReport,

  arrivalsNewsCategoryWiseReport,
  arrivalsNewsTypeWiseReport,
  arrivalsNewsPriorityWiseReport,
  arrivalsNewsStatusWiseReport,
  arrivalsNewsCompleteReport
};