import { type AxiosRequestConfig } from 'axios'
import { whiteList } from '@/config/whitelist'
import { getToken } from '@/utils/cookies'
import { request } from '@/utils/request'

export type APIMethod = 'post' | 'get'
export type Converter<T> = (response: any) => T

export interface IAPIProps<T> {
  url: string
  params?: Object
  method?: APIMethod
  responseConverter?: Converter<T>
}

export abstract class BaseApi<T> {
  protected readonly url: string
  protected readonly params: Object
  protected readonly method: APIMethod = 'get'
  protected readonly responseConverter?: Converter<T>

  constructor({
    url,
    responseConverter,
    params = {},
    method = 'get',
  }: IAPIProps<T>) {
    this.url = url
    this.params = params
    this.method = method
    this.responseConverter = responseConverter
  }

  public send(): Promise<T> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    }

    if (!whiteList.includes(this.url)) {
      // 携带 Token
      headers.Authorization = getToken()
    }

    const options: AxiosRequestConfig = {
      method: this.method.toUpperCase(),
      url: this.url,
      headers,
    }

    if (this.method.toUpperCase() === 'GET')
      options.params = this.params

    else
      options.data = this.params

    return new Promise((resolve, reject) => {
      request.request(options).then((response: any) => {
        const data = response.data
        if (data.success) {
          return resolve(
            this.responseConverter ? this.responseConverter(data.value) : data.value,
          )
        }
        else {
          // eslint-disable-next-line prefer-promise-reject-errors
          return reject({
            code: data.code,
            message: data.message || 'Something goes wrong',
          })
        }
      }).catch((response: any) => {
        // eslint-disable-next-line prefer-promise-reject-errors
        return reject({
          code: response.code,
          message: response.message || 'Something goes wrong',
        })
      })
    })
  }
}
