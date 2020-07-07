const user = require('../controllers/user.controller');
const { v1: uuidv1 } = require('uuid');
const fs = require('fs');
const path = require('path');

const uploadFile = (req, res) => {
  let type = req.params.type;
  let id = req.params.id;
  let file = req.files.file;

  let fileName = file.name.split('.');
  let fileExt = fileName[fileName.length - 1];

  let goodExts = ['png', 'jpg', 'jpeg', 'gif'];
  let goodTypes = ['users', 'products'];

  if (!req.files) {
    return res.status(400).json({
      ok: false,
      error: {
        message: `No se ha seleccionado un archivo`,
      },
    });
  }

  if (goodExts.indexOf(fileExt) < 0) {
    return res.status(200).json({
      ok: false,
      error: {
        message: `Las extensiones validas son: ${goodExts.join(', ')}`,
      },
    });
  }

  if (goodTypes.indexOf(type) < 0) {
    return res.status(200).json({
      ok: false,
      error: {
        message: `Los tipos permitidos son: ${goodTypes.join(', ')}`,
      },
    });
  }

  let newFileName = `${id}-${uuidv1()}.${fileExt}`;

  file.mv(`uploads/${type}/${newFileName}`, (error) => {
    if (error) {
      return res.status(400).json({
        ok: false,
        error,
      });
    }

    userImage(id, res, newFileName, type);
  });
};

const userImage = async (id, res, fileName, type) => {
  let userToUpdate;
  try {
    userToUpdate = await user.getUserById(id);
    if (!userToUpdate) {
      deleteImage(fileName, type);

      return res.status(400).json({
        ok: false,
        error: {
          message: `El usuario no existe`,
        },
      });
    }

    deleteImage(userToUpdate.image, type);

    userToUpdate.image = fileName;
    let req = {
      params: {
        id: userToUpdate.id,
      },
      body: {
        image: userToUpdate.image,
      },
    };

    user.updateUser(req, res);
  } catch (error) {
    deleteImage(fileName, type);

    res.status(500).json({
      ok: false,
      error,
    });
  }
};

const productImage = () => {};

const deleteImage = (imageName, type) => {
  let pathFile = path.resolve(__dirname, `../../uploads/${type}/${imageName}`);

  if (fs.existsSync(pathFile)) {
    fs.unlinkSync(pathFile);
  }
};

module.exports = {
  uploadFile,
};
