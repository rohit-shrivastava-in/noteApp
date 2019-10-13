export default function myCtrl($scope, NotesService) {
    var IDLE_TIMEOUT = 5; //5 seconds inactivity
    var _idleSecondsCounter = 0;

    $scope.products = ["Milk", "Bread", "Cheese"];
    $scope.folder = [];
    $scope.notes = [];
    $scope.selectedNotes = []
    $scope.selectedFolder = 0;
    $scope.selectedNote = {};
    $scope.toggle = false;
    $scope.isEditable = false;
    $scope.isNew = false;
    getFolders();

    document.onclick = () => _idleSecondsCounter = 0;
    document.onmousemove = () => _idleSecondsCounter = 0;
    document.onkeypress = () => _idleSecondsCounter = 0;

    window.setInterval(CheckIdleTime, 1000);
    function CheckIdleTime() {
        _idleSecondsCounter++;
       if (_idleSecondsCounter >= IDLE_TIMEOUT) {
            $scope.handleSaveNote()
           _idleSecondsCounter = 0;
       }
    }

    $scope.createFolder = function () {
        const folderName = $scope.folderName;
        if (folderName) {
            NotesService.createFolder(folderName)
            getFolders();
            $scope.folderName = ""
        }
    }

    $scope.handleToggle = function () {
        $scope.toggle = !$scope.toggle;
    }

    $scope.handleChangeFolder = function (id) {
        $scope.selectedFolder = id;
        filterNotes()
    }

    $scope.handleSelectNote = function (note) {
        $scope.selectedNote = note;
        $scope.isEditable = false;
        $scope.isNew = false;
    }

    function sortValue(data) {
        data = data.sort(function (a, b) {
            var nameA = a.folderName.toUpperCase();
            var nameB = b.folderName.toUpperCase();
            if (nameA < nameB) {
                return -1;
            } else if (nameA > nameB) {
                return 1;
            } else {
                return 0;
            }
        })
        $scope.selectedFolder = data[0].id;
        getNotes();
        return data
    }

    function getFolders() {
        NotesService.getFolders().then(response => {
            $scope.folders = sortValue(response.data);
        })
    }

    function getNotes() {
        NotesService.getNotes().then(response => {
            $scope.notes = response.data;
            filterNotes()
        })
    }

    $scope.handleCreateNote = function () {
        $scope.selectedNote = {
            "folderId": $scope.selectedFolder,
            "notesTitle": "",
            "notesDesc": ""
        }
        $scope.isEditable = true;
        $scope.isNew = true;
    }

    $scope.handleSaveNote = function () {
        let { notesDesc, notesTitle } = $scope.selectedNote;
        if(($scope.isEditable || $scope.isNew) &&  (notesDesc || notesTitle)){
            let selectedNote = $scope.selectedNote;
            $scope.isNew && (selectedNote.folderId = $scope.selectedFolder);
            NotesService.createNote(selectedNote).then(function(response){
                $scope.selectedNote = response.data;
            })
            getFolders();
        }
    }

    $scope.handleDeleteNote = function () {
        const id = $scope.selectedNote.id;
        if (id >= 0) {
            NotesService.deleteNote(id);
            $scope.selectedNote = {}
            getFolders();
        }
    }

    $scope.handleEditable = function () {
        $scope.isEditable = true;
        $scope.isNew = false;
    }

    function filterNotes() {
        if ($scope.selectedFolder >= 0) {
            $scope.selectedNotes = $scope.notes.filter(function (note) {
                return note.folderId == $scope.selectedFolder;
            })
        } else {
            $scope.selectedNotes = $scope.notes;
        }
        $scope.isEditable = false;
        // $scope.selectedNote = $scope.selectedNotes[0];
    }

}