class ErrorHandler {
  handleApiError(error) {
    console.error("API Error:", error);

    if (error.response) {
      return this.handleResponseError(error.response);
    }

    if (error.request) {
      return this.handleNetworkError();
    }

    return this.handleUnexpectedError();
  }

  handleResponseError(response) {
    switch (response.status) {
      case 400:
        return "Некорректные данные";
      case 401:
        return "Необходима авторизация";
      case 403:
        return "Доступ запрещен";
      case 404:
        return "Ресурс не найден";
      case 500:
        return "Внутренняя ошибка сервера";
      default:
        return "Что-то пошло не так";
    }
  }

  handleNetworkError() {
    return "Ошибка сети. Проверьте подключение к интернету";
  }

  handleUnexpectedError() {
    return "Произошла непредвиденная ошибка";
  }

  handleValidationError(errors) {
    return Object.values(errors).join(". ");
  }
}

export const errorHandler = new ErrorHandler();
