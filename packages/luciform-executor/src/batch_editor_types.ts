export interface BatchActionFeedback {
  type: string;
  action: any;
  status: 'success' | 'error' | 'stubbed';
  error?: any;
  message?: string;
  extra?: any;
}

export class ResultAggregator {
  private results: BatchActionFeedback[] = [];

  add(feedback: BatchActionFeedback): void {
    this.results.push(feedback);
  }

  all(): BatchActionFeedback[] {
    return this.results;
  }

  successes(): BatchActionFeedback[] {
    return this.results.filter(r => r.status === 'success');
  }

  errors(): BatchActionFeedback[] {
    return this.results.filter(r => r.status === 'error');
  }

  stubbed(): BatchActionFeedback[] {
    return this.results.filter(r => r.status === 'stubbed');
  }
}