import { Signal, useSignal } from "@preact/signals";
import { useCallback } from "preact/hooks";
import Button from "$store/components/ui/Button.tsx";
import { formatPrice } from "$store/sdk/format.ts";
import { useCart } from "apps/shopify/hooks/useCart.ts";

type Simulation = any

export interface Props {
  items: {
    variantId: string;
    quantity: number;
  }[];
}

const formatShippingEstimate = (estimate: string) => {
  const [, time, type] = estimate.split(/(\d+)/);

  if (type === "bd") return `${time} dias úteis`;
  if (type === "d") return `${time} dias`;
  if (type === "h") return `${time} horas`;
};

function ShippingContent({ simulation }: {
  simulation: number;
}) {

  console.log(simulation)

  const methods = simulation.value?.calculatedDraftOrder.availableShippingRates

  if (simulation.value == null) {
    return null;
  }

  if (methods?.length === 0) {
    return (
      <div class="p-2">
        <span>CEP inválido</span>
      </div>
    );
  }

  return (
    <ul class="flex flex-col gap-4 p-4 bg-base-200 rounded-[4px]">
      {methods?.map((method) => (
        <li class="flex justify-between items-center border-base-200 not-first-child:border-t">
          <span class="text-button text-center">
            Entrega {method.title}
          </span>
          <span class="text-base font-semibold text-right">
            {Number(method.price.amount) === 0 ? "Grátis" : (
              formatPrice(Number(method.price.amount))
            )}
          </span>
        </li>
      ))}
      <span class="text-base-300">
        Os prazos de entrega começam a contar a partir da confirmação do
        pagamento e podem variar de acordo com a quantidade de produtos na
        sacola.
      </span>
    </ul>
  );
}

function ShippingSimulation({ items }: Props) {
  const postalCode = useSignal("");
  const loading = useSignal(false);
  const simulateResult = useSignal<Simulation | null>(null);
  const { simulate } = useCart();

  const handleSimulation = useCallback(async () => {
    console.log("rodou")
    if (postalCode.value.length !== 8) {
      return;
    }

    try {
      loading.value = true;
      /* simulateResult.value = await simulate({
        items: items,
        postalCode: postalCode.value,
        country: cart.value?.storePreferencesData.countryCode || "BRA",
      }); */

      simulateResult.value = await simulate({
        input: {
            lineItems: items,
            shippingAddress: {
              zip: postalCode.value,
              countryCode: "BR"
            }
        }
      })
      
    } finally {
      loading.value = false;
    }
  }, []);

  return (
    <div class="flex flex-col gap-2">
      <div class="flex flex-col">
        <span>Calcular frete</span>
        <span>
          Informe seu CEP para consultar os prazos de entrega
        </span>
      </div>

      <form
        class="join"
        onSubmit={(e) => {
          e.preventDefault();
          handleSimulation();
        }}
      >
        <input
          as="input"
          type="text"
          class="input input-bordered join-item min-w-[200px]"
          placeholder="Seu cep aqui"
          value={postalCode.value}
          maxLength={8}
          size={8}
          onChange={(e: { currentTarget: { value: string } }) => {
            postalCode.value = e.currentTarget.value;
          }}
        />
        <Button type="submit" loading={loading.value} class="join-item">
          Calcular
        </Button>
      </form>

      <div>
        <div>
          <ShippingContent simulation={simulateResult} />
        </div>
      </div>
    </div>
  );
}

export default ShippingSimulation;