import java.nio.file.Path;
import java.nio.file.Paths;
public class TestPath {
    public static void main(String[] args) {
        Path uploadDir = Paths.get("uploads/");
        String uploadPath = uploadDir.toFile().getAbsolutePath();
        System.out.println("uploadPath: " + uploadPath);
        System.out.println("Result 1 (yours): file:/" + uploadPath + "/");
        System.out.println("Result 2: file://" + uploadPath + "/");
        System.out.println("Result 3: file:" + uploadPath + "/");
    }
}
