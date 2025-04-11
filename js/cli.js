/* global $, localStorage, Shell */

const errors = {
  invalidDirectory: 'Error: not a valid directory',
  noWriteAccess: 'Error: you do not have write access to this directory',
  fileNotFound: 'Error: file not found in current directory',
  fileNotSpecified: 'Error: you did not specify a file'
}

const struct = {
  seth: ['about', 'skills', 'label', 'location', 'education','history']
}

const commands = {}
let systemData = {}
const rootPath = 'users/seth'

const getDirectory = () => localStorage.directory
const setDirectory = (dir) => { localStorage.directory = dir }

// turn on fullscreen
const registerFullscreenToggle = () => {
  $('.button.green').click(() => {
    $('.terminal-window').toggleClass('fullscreen')
  })
}

// create new directory in current directory
commands.mkdir = commands.Mkdir = () => errors.noWriteAccess

// create new directory in current directory
commands.touch = commands.Touch = () => errors.noWriteAccess

// remove file from current directory
commands.rm = commands.Rm = () => errors.noWriteAccess

// view contents of specified directory
commands.ls = commands.Ls = (directory) => {
  if (directory === '..' || directory === '~') {
    return systemData['seth']
  }
  return systemData[getDirectory()]
}

// view list of possible commands
commands.help = commands.Help = () => systemData.help

// display current path
commands.path = commands.Path = () => {
  const dir = getDirectory()
  return dir === 'seth' ? rootPath : `${rootPath}/${dir}`
}

// see command history
commands.history = commands.History = () => {
  let history = localStorage.history
  history = history ? Object.values(JSON.parse(history)) : []
  return `<p>${history.join('<br>')}</p>`
}

// move into specified directory
commands.cd = commands.Cd = (newDirectory) => {
  const currDir = getDirectory()
  const dirs = Object.keys(struct)
  const newDir = newDirectory ? newDirectory.trim() : ''

  if (dirs.includes(newDir) && currDir !== newDir) {
    setDirectory(newDir)
  } else if (newDir === '' || newDir === '~' || (newDir === '..' && dirs.includes(currDir))) {
    setDirectory('seth')
  } else if (newDir !== '.') {
    return errors.invalidDirectory
  }
  return null
}

// display contents of specified file
commands.cat = commands.Cat = (filename) => {
  if (!filename) return errors.fileNotSpecified

  const dir = getDirectory()
  const fileKey = filename.split('.')[0]

  if (fileKey in systemData && struct[dir].includes(fileKey)) {
    return systemData[fileKey]
  }

  return errors.fileNotFound
}

// initialize cli
$(() => {
  registerFullscreenToggle()
  const cmd = document.getElementById('terminal')
  const terminal = new Shell(cmd, commands)

  $.ajaxSetup({ cache: false })
  $.get('data/system_data.json', (data) => {
    systemData = data
  })
})
