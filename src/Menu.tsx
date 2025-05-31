import {
  NavigationMenuItem,
  NavigationMenuLink,
} from "./components/ui/navigation-menu";

export function Menu() {
  return (
    <NavigationMenuItem>
      <NavigationMenuLink asChild></NavigationMenuLink>
    </NavigationMenuItem>
  );
}
