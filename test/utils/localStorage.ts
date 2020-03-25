const previousLocalStorage =
  typeof window !== "undefined" ? window.localStorage : undefined;

export const mockLocalStorage = (mockWindow = true) => {
  const storageState: Record<string, string> = {};

  const localStorageMock = {
    key: jest.fn(),
    clear: jest.fn(),
    getItem: jest.fn(),
    removeItem: jest.fn(),
    length: 0,
    setItem: jest.fn(),
  };

  localStorageMock.getItem.mockImplementation((key: string) => {
    return storageState[key] ?? null;
  });
  localStorageMock.setItem.mockImplementation((key: string, data: string) => {
    storageState[key] = data;
  });
  localStorageMock.removeItem((key: string) => {
    delete storageState[key];
  });

  if (mockWindow)
    Object.defineProperty(window, "localStorage", {
      value: localStorageMock,
    });

  const unmockLocalStorage = () => {
    if (mockWindow)
      Object.defineProperty(window, "localStorage", {
        value: previousLocalStorage,
      });
  };

  return {
    localStorageMock,
    unmockLocalStorage,
  };
};
