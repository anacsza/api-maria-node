import multer from "multer";
import cosmicjs from "cosmicjs";

const { CHAVE_CAPA_LIVRO, BUCKET_CAPA_LIVRO } = process.env;

const Cosmic = cosmicjs();
const bucketCapaLivro = Cosmic.bucket({
  slug: BUCKET_CAPA_LIVRO,
  write_key: CHAVE_CAPA_LIVRO,
});

const storage = multer.memoryStorage();
const uploadMulter = multer({ storage: storage });

const uploadImage = async (req: any) => {
    console.log("upload")
  if (req.file.originalname) {
    if (
      !req.file.originalname.includes(".png") &&
      !req.file.originalname.includes(".jpeg") &&
      !req.file.originalname.includes(".jpg")
    ) {
      throw new Error("O formato da imagem é inválido.");
    }

    const mediaCosmic = {
      originalname: req.file.originalname,
      buffer: req.file.buffer,
    };

    return await bucketCapaLivro.addMedia({ media: mediaCosmic });
  }
};

export { uploadMulter, uploadImage };
