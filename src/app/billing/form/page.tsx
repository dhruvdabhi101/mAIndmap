"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { createPaymentLink } from "./actions";
import { countries } from "@/lib/countries";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          Processing...
        </>
      ) : (
        "Continue to Payment"
      )}
    </Button>
  );
}

export default function BillingForm() {
  const [selectedCountry, setSelectedCountry] = useState("");
  const [formState, setFormState] = useState({
    street: "",
    apartment: "",
    city: "",
    state: "",
    zipcode: "",
    quantity: 1,
  });

  async function onSubmit(formData: FormData) {
    const result = await createPaymentLink(formData);

    if (result.error) {
      toast.error(result.error);
      return;
    }

    if (result.success) {
      toast.success("Redirecting to payment...");
      window.location.href = result.paymentUrl;
    }
  }

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Billing Information</CardTitle>
        <CardDescription>
          Please enter your billing address for payment processing
        </CardDescription>
      </CardHeader>
      <form action={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="street">Street Address</Label>
            <Input
              id="street"
              name="street"
              placeholder="123 Main St"
              required
              value={formState.street}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, street: e.target.value }))
              }
              className="focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="apartment">Apartment, suite, etc. (optional)</Label>
            <Input
              id="apartment"
              name="apartment"
              placeholder="Apt #, Suite, etc."
              value={formState.apartment}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, apartment: e.target.value }))
              }
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="country">Country/Region</Label>
            <Select
              name="country"
              required
              value={selectedCountry}
              onValueChange={(value) => {
                setSelectedCountry(value);
                setFormState((prev) => ({ ...prev, state: "" }));
              }}
            >
              <SelectTrigger id="country" className="w-full">
                <SelectValue placeholder="Select country" />
              </SelectTrigger>
              <SelectContent className="max-h-[300px]">
                {countries.map((country) => (
                  <SelectItem
                    key={country.code}
                    value={country.code}
                    className="flex items-center gap-2"
                  >
                    <span className="mr-2">{country.flag}</span>
                    {country.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                name="city"
                placeholder="City"
                required
                value={formState.city}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, city: e.target.value }))
                }
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="state">
                {selectedCountry === "US"
                  ? "State"
                  : selectedCountry === "CA"
                  ? "Province"
                  : "State/Province"}
              </Label>
              <Input
                id="state"
                name="state"
                placeholder="State/Province"
                required
                value={formState.state}
                onChange={(e) =>
                  setFormState((prev) => ({ ...prev, state: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="zipcode">
              {selectedCountry === "US" ? "ZIP Code" : "Postal Code"}
            </Label>
            <Input
              id="zipcode"
              name="zipcode"
              placeholder={selectedCountry === "US" ? "12345" : "Postal code"}
              required
              value={formState.zipcode}
              onChange={(e) =>
                setFormState((prev) => ({ ...prev, zipcode: e.target.value }))
              }
              className="max-w-[200px]"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="quantity">Quantity</Label>
            <Input
              id="quantity"
              name="quantity"
              type="number"
              min="1"
              required
              value={formState.quantity}
              onChange={(e) =>
                setFormState((prev) => ({
                  ...prev,
                  quantity: parseInt(e.target.value),
                }))
              }
              className="max-w-[100px]"
            />
            <p className="text-sm text-muted-foreground">
              Each quantity adds 5 mindmaps to your account
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <SubmitButton />
        </CardFooter>
      </form>
    </Card>
  );
}
