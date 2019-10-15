export default function NotesService($http) {

  function getFolders() {
    return $http.get('http://localhost:3000/folder')
  }

  function getNotes() {
    return $http.get('http://localhost:3000/notes')
  }

  function createFolder(folderName) {
    return $http({
      method: 'POST',
      url: 'http://localhost:3000/folder',
      data: $.param({
        folderName
      }),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  function deleteNote(id) {
    return $http.delete(`http://localhost:3000/notes/${id}`)
  }

  function createNote({
    id,
    folderId,
    notesTitle,
    notesDesc,
    createdDate
  }) {
    let params = {
      folderId,
      notesTitle,
      notesDesc,
      createdDate
    }
    if (id) params.id = id;
    let method = id ? 'PUT' : 'POST';
    let uri = id ? `/${id}` : ``;
    return $http({
      method,
      url: `http://localhost:3000/notes${uri}`,
      data: $.param(params),
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    })
  }

  return {
    getFolders,
    getNotes,
    createFolder,
    deleteNote,
    createNote
  }
}