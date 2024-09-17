export type GetListResponseType<T> = {
  data: T[];
  total: number;
};

export type DeepPartial<T> = T extends object
  ? {
      [P in keyof T]?: DeepPartial<T[P]>;
    }
  : T;
