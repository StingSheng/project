async function request(method: string, body: string, url: string) {
  let res = await fetch(url, {
    method,
    body,
    headers : {
      'content-type': 'application/json'
    },
  })
  let json = await res.json()
  return json
}

export function post(body:string, url: string) {
  return request('POST',body, url)
}