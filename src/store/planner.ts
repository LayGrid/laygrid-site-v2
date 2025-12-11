import { create } from "zustand";

import { devtools } from "zustand/middleware";

import { produce } from "immer";

export type Settings = {

  scalePxPerM: number;

  snapM: number;

  enforceBoundary: boolean;

};

export type Boundary = {

  type: "rect";

  widthM: number;

  depthM: number;

  locked: boolean;

};

export type FileRef = {

  id: string;

  name: string;

  size: number;

  type: string;

  url: string;

};

export type BlockMeta = {
  description?: string;          // frei formulierter Text
  clearanceM?: number;           // min. umlaufender Abstand
  rotationAllowed?: boolean;     // darf rotiert werden?
  preferNear?: string[];         // IDs, die nah sein sollen
  avoidNear?: string[];          // IDs, die nicht nah sein sollen
  zone?: "raw" | "machining" | "assembly" | "shipping" | "office" | "custom"; // optional
};

export type Block = {

  id: string;

  name: string;

  wM: number;

  dM: number;

  hM?: number;

  xM: number;

  yM: number;

  rotationDeg: number;

  color: string;

  fileRefId?: string;

  meta?: BlockMeta;

};

export type FlowEdge = {
  fromId: string;
  toId: string;
  weight: number;   // wie wichtig/häufig (z. B. 1..100)
  bidirectional?: boolean;
};

export type AISolution = {

  score: number;

  blocks: Array<{ id: string; xM: number; yM: number; rotationDeg: number }>;

};

type PlannerState = {

  settings: Settings;

  boundary: Boundary | null;

  files: FileRef[];

  blocks: Block[];

  selectedId: string | null;

  camera: { x: number; y: number; scale: number };

  // KI

  aiSolutions: AISolution[];

  showAIModal: boolean;

  // Vorschau-Overlay

  previewBlocks: Array<{ id: string; xM: number; yM: number; rotationDeg: number }> | null;

  // actions

  setBoundary: (b: Boundary) => void;

  setSettings: (p: Partial<Settings>) => void;

  addBlock: (b: Omit<Block, "id">) => void;

  updateBlock: (id: string, p: Partial<Block>) => void;

  deleteBlock: (id: string) => void;

  setSelected: (id: string | null) => void;

  addFiles: (fs: File[]) => Promise<void>;

  setCamera: (p: Partial<PlannerState["camera"]>) => void;

  reset: () => void;

  // KI actions

  setAISolutions: (s: AISolution[]) => void;

  setAIModal: (open: boolean) => void;

  applyAISolution: (index: number) => void;

  // Vorschau

  setPreviewBlocks: (

    s: Array<{ id: string; xM: number; yM: number; rotationDeg: number }> | null

  ) => void;

};

const uid = () => Math.random().toString(36).slice(2, 10);

export const usePlanner = create<PlannerState>()(

  devtools((set, get) => ({

    


    

    settings: { scalePxPerM: 100, snapM: 0.5, enforceBoundary: true },

    boundary: null,

    files: [],

    blocks: [],

    selectedId: null,

    camera: { x: 0, y: 0, scale: 1 },

    aiSolutions: [],

    showAIModal: false,

    previewBlocks: null,

    setBoundary: (b) => set({ boundary: b }),

    setSettings: (p) => set((s) => ({ settings: { ...s.settings, ...p } })),

    addBlock: (b) =>

      set((s) =>

        produce(s, (draft) => {

          draft.blocks.push({ ...b, id: uid() });





          

        })

      ),

    updateBlock: (id, p) =>

      set((s) =>

        produce(s, (draft) => {

          const i = draft.blocks.findIndex((x) => x.id === id);

          if (i >= 0) draft.blocks[i] = { ...draft.blocks[i], ...p };

        })

      ),

    deleteBlock: (id) =>

      set((s) =>

        produce(s, (draft) => {

          draft.blocks = draft.blocks.filter((x) => x.id !== id);

          if (draft.selectedId === id) draft.selectedId = null;

        })

      ),

    setSelected: (id) => set({ selectedId: id }),

    addFiles: async (fs) => {

      const entries: FileRef[] = await Promise.all(

        fs.map(async (f) => ({

          id: uid(),

          name: f.name,

          size: f.size,

          type: f.type,

          url: URL.createObjectURL(f),

        }))

      );

      set((s) => ({ files: [...s.files, ...entries] }));

    },

    setCamera: (p) => set((s) => ({ camera: { ...s.camera, ...p } })),

    reset: () =>

      set({

        settings: { scalePxPerM: 100, snapM: 0.5, enforceBoundary: true },

        boundary: null,

        files: [],

        blocks: [],

        selectedId: null,

        camera: { x: 0, y: 0, scale: 1 },

        aiSolutions: [],

        showAIModal: false,

        previewBlocks: null,

      }),

    setAISolutions: (solutions) => set({ aiSolutions: solutions }),

    setAIModal: (open) => set({ showAIModal: open }),

    applyAISolution: (index) =>

      set((s) =>

        produce(s, (draft) => {

          const sol = draft.aiSolutions[index];

          if (!sol) return;

          for (const move of sol.blocks) {

            const i = draft.blocks.findIndex((b) => b.id === move.id);

            if (i >= 0) {

              draft.blocks[i].xM = move.xM;

              draft.blocks[i].yM = move.yM;

              draft.blocks[i].rotationDeg = move.rotationDeg;

            }

          }

          draft.previewBlocks = null;

          draft.showAIModal = false;

        })

      ),

    setPreviewBlocks: (arr) => set({ previewBlocks: arr }),

  }))

);
 