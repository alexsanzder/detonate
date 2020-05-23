export const scrapeIssueInfo = (platform, tab) => {
  let targetNode;

  const modalMountingPoint = document.querySelector('#detonate-modal');

  switch (platform) {
    case 'JIRA':
      // Jira issue summary
      const summaryVal = document.querySelector('#summary-val') as HTMLElement;
      const summary = summaryVal.innerText;
      // Jira parent issue summary
      const parentIssueSummary = document.querySelector('#parent_issue_summary');
      const parentTicket = parentIssueSummary && parentIssueSummary.getAttribute('data-issue-key');
      const project = parentIssueSummary && parentIssueSummary.getAttribute('original-title');

      let contentMountingPoint;
      let issueTicket;
      if (tab.title.includes('Agile Board')) {
        contentMountingPoint = document.createElement('div');
        contentMountingPoint.setAttribute('id', 'detonate-button');
        contentMountingPoint.setAttribute('class', 'select-none relative pt-3 pl-3');
        modalMountingPoint.setAttribute('class', 'fixed z-50 w-84');
        targetNode = document.querySelector('.ghx-group');
        const issueKey = document.querySelector('#issuekey-val a') as HTMLAnchorElement;
        issueTicket = issueKey && issueKey.text;
      } else {
        contentMountingPoint = document.createElement('span');
        contentMountingPoint.setAttribute('id', 'detonate-button');
        contentMountingPoint.setAttribute('class', 'select-none fixed pt-3 top-0 pt-3 mt-px ');
        modalMountingPoint.setAttribute('class', 'fixed z-50 w-96');
        targetNode = document.querySelector('.aui-nav-breadcrumbs');

        const issueKey = document.querySelector('#key-val');
        issueTicket = issueKey && issueKey.getAttribute('data-issue-key');
      }

      return {
        description: `${issueTicket} ${summary}`,
        project: project,
        ticket: parentTicket ? parentTicket : issueTicket,
        contentMountingPoint,
        targetNode,
      };

    default:
      break;
  }
};
