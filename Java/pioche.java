package Java;
import java.util.ArrayList;
import java.util.List;

public class pioche {
    List<String> cartes = new ArrayList<>();

    public List<String> getCartes() {
        return cartes;
    }

    public void setCartes(List<String> cartes) {

    }
public static void main(String[] args) {
    List<String> cartes = new ArrayList<>();
    cartes.add("Virus");
    cartes.add("Cheval de Troie");
    cartes.add("Anonymous");
    cartes.add("Panne réseau");
    cartes.add("Brutforcing");
    System.out.println(cartes);
}
}
