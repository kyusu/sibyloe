import { createHash } from "node:crypto"
import { env, exit } from "node:process"

/* eslint-disable no-undef */

if (!env.USER_NAME) {
  console.error("No user name given")
  exit(1)
}

if (!env.SERVER_BASE_PATH) {
  console.error("No base path for server given")
  exit(1)
}

if (!env.PASSWORD) {
  console.error("No password given")
  exit(1)
}

if (!env.SALT) {
  console.error("No salt given")
  exit(1)
}

if (!env.CLIENT_ID) {
  console.error("No client id given")
  exit(1)
}

if (!env.PROTOCOL_VERSION) {
  console.error("No protocol version given")
  exit(1)
}

const token = createHash("md5").update(`${env.PASSWORD}${env.SALT}`).digest("hex")
const getRandomSongUrl =
  `${env.SERVER_BASE_PATH}/rest/getRandomSongs?u=${env.USER_NAME}&t=${token}&s=${env.SALT}&v=${env.PROTOCOL_VERSION}&c=${env.CLIENT_ID}&size=1`

const albumName = /album="(.+)" artist=/gm
const albumId = /albumId="(.+)" artistId=/gm

fetch(getRandomSongUrl).then((resp) => resp.text()).then((xml) => {
  console.log(Array.from(xml.matchAll(albumName))[0][1])
  const id = Array.from(xml.matchAll(albumId))[0][1]
  console.log(`${env.SERVER_BASE_PATH}/app/#/album/${id}/show`)
})
