export async function requestJson(body:string, url: string) {
  let res = await fetch(url, {
    method: "POST",
    body,
    headers : {
      'content-type': 'application/json'
    },
  })
  let json = await res.json()
  return json
}

export async function requestFile(body: FormData, url: string) {
  let res = await fetch(url, {
    method: "POST",
    body
  })
  let json = await res.json()
  return json
}



// export function post(body:any, url: string) {
//   return request('POST',body, url)
// }