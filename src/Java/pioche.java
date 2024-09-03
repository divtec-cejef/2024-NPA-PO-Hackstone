package src.Java;
import java.util.ArrayList;
import java.util.List;

public class pioche {
    static List<String> cartes = new ArrayList<>();

    public static int getRandom(int min, int max) {
        int range = (max - min) + 1;
        int random = (int) ((range * Math.random()) + min);
        return random;
    }

    public static List<String> DrawCartes(List<String> Listcartes) {
        for (int i = 0; i < 3; i++) {
            int a = getRandom(0, Listcartes.size()-1);
            cartes.add(Listcartes.get(a));
            Listcartes.remove(a);
        }
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
        List<String> cartes2 = new ArrayList<>();
        cartes2 = DrawCartes(cartes);
        System.out.println(cartes2);
    }
}