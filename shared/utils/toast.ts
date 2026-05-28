interface INotificationPayload {
  message?: string
}

export abstract class IToastAdapter {
  abstract success(payload: INotificationPayload): void
  abstract error(payload: INotificationPayload): void
  abstract info(payload: INotificationPayload): void
  abstract warning(payload: INotificationPayload): void
}

export class ToastService extends IToastAdapter {
  success(payload: INotificationPayload) {
    // ElMessage({
    //   message: payload.message,
    //   type: 'success',
    //   grouping: true
    // })
  }

  error(payload: INotificationPayload): void {
    // ElMessage({
    //   message: payload.message,
    //   type: 'error',
    //   grouping: true
    // })
  }

  info(payload: INotificationPayload): void {
    // ElMessage({
    //   message: payload.message,
    //   type: 'info',
    //   grouping: true
    // })
  }

  warning(payload: INotificationPayload): void {
    // ElMessage({
    //   message: payload.message,
    //   type: 'warning',
    //   grouping: true
    // })
  }
}

export const Toast = new ToastService()
